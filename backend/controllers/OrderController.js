import Order from "../models/Order.js";
import User from "../models/User.js";
import { getInitialRandomCirculation } from "../utils/randomCirculation.js";
import { startCronForOrder , stopCronForOrder,handleOrderUpdate } from "../utils/cron.js";
import { updatePortfolio } from "./PortfolioController.js";
import jwt from 'jsonwebtoken'
const placeOrder = async (req, res) => {
    try {
        const {security, quantity, price, orderType } = req.body;

        console.log("place Order :" ,req.body)
        const token=req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token' });
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        // console.log(decode.id)
        const userId=decode.id;
        const circulationQuantity = getInitialRandomCirculation(Number(quantity));
        console.log(circulationQuantity)
        let status;
        let executedQuantity;
        let lastCycleQuantity;

        if (circulationQuantity >= quantity) {
            status = 'EXECUTED';
            executedQuantity = quantity;
            lastCycleQuantity = executedQuantity;
        } else {
            status = 'PARTIALLY_EXECUTED';
            executedQuantity = circulationQuantity;
            lastCycleQuantity = executedQuantity;
        }

        const newOrder = new Order({
            userId,
            security,
            quantity,
            executedQuantity,
            lastCycleQuantity,
            price,
            orderType,
            status
        });

        const savedOrder = await newOrder.save();

        startCronForOrder(savedOrder._id);

        await User.findByIdAndUpdate(userId, {
            $push: { orders: savedOrder._id }
        });

    
        await updatePortfolio(userId, security, lastCycleQuantity, price, orderType);  
        

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
        // await updatePortfolio(userId, security, executedQuantity, price, orderType);
        if (newQuantity < order.executedQuantity) {
            return res.status(400).json({ message: "New quantity cannot be less than already executed quantity" });
        }
        order.quantity = newQuantity;
        order.price = newPrice || order.price;
        order.updatedAt = Date.now();
        order.status = 'PENDING';
        order.lastCycleQuantity = 0;
        await order.save();
        await handleOrderUpdate(orderId,true);
        
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
        const { orderId,security,executedQuantity, quantity, price, orderType} = req.body;
        console.log(req.body)
        // const {security, quantity, price, orderType } = req.body;
        const token=req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token' });
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        // console.log(decode.id)
        const userId=decode.id;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== 'PARTIALLY_EXECUTED') {
            return res.status(400).json({ message: "Only partially executed orders can be cancelled" });
        }

        order.status = 'CANCELLED';
        order.updatedAt = Date.now();
        order.quantity=executedQuantity;
        order.lastCycleQuantity = 0;
        
        stopCronForOrder(orderId);

        await order.save();
        await updatePortfolio(userId, security, order.lastCycleQuantity, price, orderType);
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