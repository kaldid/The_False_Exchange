import Order from '../models/Order.js';
import { getRandomCirculation } from './randomCirculation.js';
import { updatePortfolio } from '../controllers/PortfolioController.js';

const activeOrderTimers = new Map(); // OrderId -> timerId

async function handleOrderUpdate(orderId ,flag=false) {
    if (flag){
        console.log('only update potfolio')
        try{
            const order = await Order.findById(orderId);
            await updatePortfolio(order.userId, order.security, order.lastCycleQuantity, order.price);
        }
        catch (error) {
            console.error(`error updating portfolio while amending order ${orderId}:`, error);
        }
    }
    else{
        try {
    
            console.log("handle order update excuted")
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
                console.log('remainig quamt: ', remainingQuantity)
            if (remainingQuantity <= 0) {
                order.status = 'EXECUTED';
                order.updatedAt = Date.now();
                await order.save();
                await updatePortfolio(order.userId, order.security, order.lastCycleQuantity, order.price);
                stopCronForOrder(orderId);
                return;
            }
    
            const circulationQuantity = getRandomCirculation(remainingQuantity);
            console.log('From handle order :',circulationQuantity )
            if (circulationQuantity >= remainingQuantity) {
                order.executedQuantity = order.quantity;
                order.lastCycleQuantity = remainingQuantity;
                order.status = 'EXECUTED';
            } else {
                order.executedQuantity += circulationQuantity;
                order.lastCycleQuantity = circulationQuantity;
                order.status = 'PARTIALLY_EXECUTED';
            }
    
            order.updatedAt = Date.now();
            await order.save();
    
            console.log(`Updated Order ${orderId}: Status=${order.status}, ExecutedQuantity=${order.executedQuantity}`);
            
            await updatePortfolio(order.userId, order.security, order.lastCycleQuantity, order.price);
            if (order.status === 'EXECUTED') {
                stopCronForOrder(orderId);
            }
    
        } catch (error) {
            console.error(`[CRON] Error handling order ${orderId}:`, error);
        }

    }
    
}

function startCronForOrder(orderId) {
    if (activeOrderTimers.has(orderId)) {
        console.log(`Cycle already running for Order ${orderId}`);
        return;
    }

    const timerId = setInterval(async () => {
        await handleOrderUpdate(orderId);
    },30000); 
    
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

export { startCronForOrder, stopCronForOrder,handleOrderUpdate };
