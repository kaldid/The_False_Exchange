import Order from "../models/Order.js";
import User from "../models/User.js";
import { getRandomCirculation } from "../utils/randomCirculation.js";
import { startCronForOrder , stopCronForOrder } from "../utils/cron.js";
import { updatePortfolio } from "./PortfolioController.js";
import jwt from 'jsonwebtoken'
const placeOrder = async (req, res) => {
    try {
        const { userId, security, quantity, price, orderType } = req.body;

        const circulationQuantity = getRandomCirculation(quantity);

        let status;
        let executedQuantity;

        if (circulationQuantity >= quantity) {
            status = 'EXECUTED';
            executedQuantity = quantity;
        } else {
            status = 'PARTIALLY_EXECUTED';
            executedQuantity = circulationQuantity;
        }

        const newOrder = new Order({
            userId,
            security,
            quantity,
            executedQuantity,
            price,
            orderType,
            status
        });

        const savedOrder = await newOrder.save();

        startCronForOrder(savedOrder._id);

        await User.findByIdAndUpdate(userId, {
            $push: { orders: savedOrder._id }
        });

        if (status === 'EXECUTED') {
            await updatePortfolio(userId, security, quantity, price);  
        }

        return res.status(200).json({
            message: "Order placed successfully",
            order: savedOrder
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error placing order" });
    }
};

const amendOrder = async (req, res) => {
    try {
        const { orderId, newQuantity, newPrice } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== 'PARTIALLY_EXECUTED') {
            return res.status(400).json({ message: "Only partially executed orders can be amended" });
        }

        const remainingQuantity = order.quantity - order.executedQuantity;

        if (newQuantity < order.executedQuantity) {
            return res.status(400).json({ message: "New quantity cannot be less than already executed quantity" });
        }

        order.quantity = newQuantity;
        order.price = newPrice || order.price;
        order.updatedAt = Date.now();
        order.status = 'PENDING';
        await order.save();

        return res.status(200).json({
            message: "Order amended successfully",
            order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error amending order" });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== 'PARTIALLY_EXECUTED') {
            return res.status(400).json({ message: "Only partially executed orders can be cancelled" });
        }

        order.status = 'CANCELLED';
        order.updatedAt = Date.now();
        stopCronForOrder(orderId);

        await order.save();

        return res.status(200).json({
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error cancelling order" });
    }
};


const getActiveOrders = async (req, res) => {
    try {
      const token = req.cookies.token;
  
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      const activeOrders = await Order.find({ 
        userId, 
        status: { $in: ['PENDING', 'PARTIALLY_EXECUTED'] } 
      }).sort({ createdAt: -1 }); // latest first
  
      res.json({ success: true, orders: activeOrders });
  
    } catch (error) {
      console.error('Error fetching active orders:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

export {placeOrder , amendOrder , cancelOrder,getActiveOrders}