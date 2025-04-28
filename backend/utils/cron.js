import Order from '../models/Order.js';
import { getRandomCirculation } from './randomCirculation.js';
import { updatePortfolio } from '../controllers/PortfolioController.js';

const activeOrderTimers = new Map(); // OrderId -> timerId

async function handleOrderUpdate(orderId) {
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            console.log(`Order ${orderId} not found. Stopping cycle`);
            stopCronForOrder(orderId);
            return;
        }

        if (order.status === 'EXECUTED' || order.status === 'CANCELLED') {
            console.log(`Order ${orderId} already completed. Stopping cycle`);
            stopCronForOrder(orderId);
            return;
        }

        const remainingQuantity = order.quantity - order.executedQuantity;

        if (remainingQuantity <= 0) {
            order.status = 'EXECUTED';
            order.updatedAt = Date.now();
            await order.save();
            await updatePortfolio(order.userId, order.security, order.quantity, order.price);
            stopCronForOrder(orderId);
            return;
        }

        const circulationQuantity = getRandomCirculation(remainingQuantity);

        if (circulationQuantity >= remainingQuantity) {
            order.executedQuantity = order.quantity;
            order.status = 'EXECUTED';
        } else {
            order.executedQuantity += circulationQuantity;
            order.status = 'PARTIALLY_EXECUTED';
        }

        order.updatedAt = Date.now();
        await order.save();

        console.log(`Updated Order ${orderId}: Status=${order.status}, ExecutedQuantity=${order.executedQuantity}`);
        
        if (order.status === 'EXECUTED') {
            await updatePortfolio(order.userId, order.security, order.quantity, order.price);
            stopCronForOrder(orderId);
        }

    } catch (error) {
        console.error(`[CRON] Error handling order ${orderId}:`, error);
    }
}

function startCronForOrder(orderId) {
    if (activeOrderTimers.has(orderId)) {
        console.log(`Cycle already running for Order ${orderId}`);
        return;
    }

    const timerId = setInterval(async () => {
        await handleOrderUpdate(orderId);
    }, Math.floor(Math.random() * 5000) + 5000); 

    activeOrderTimers.set(orderId, timerId);
    console.log(`Started cycle for Order ${orderId}`);
}

function stopCronForOrder(orderId) {
    const timerId = activeOrderTimers.get(orderId);
    if (timerId) {
        clearInterval(timerId);
        activeOrderTimers.delete(orderId);
        console.log(`Stopped cycle for Order ${orderId}`);
    }
}

export { startCronForOrder, stopCronForOrder };
