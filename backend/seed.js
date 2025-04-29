import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js'; // Adjust the path as per your project structure

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function insertTestOrders() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    const userId = new mongoose.Types.ObjectId('680fbf9f88aad30a4cd95b32');

    const sampleOrders = [
      {
        userId,
        security: 'AAPL',
        quantity: 100,
        executedQuantity: 0,
        price: 150,
        orderType: 'BUY',
        status: 'PENDING',
      },
      {
        userId,
        security: 'GOOG',
        quantity: 50,
        executedQuantity: 25,
        price: 2700,
        orderType: 'SELL',
        status: 'PARTIALLY_EXECUTED',
      },
      {
        userId,
        security: 'TSLA',
        quantity: 20,
        executedQuantity: 20,
        price: 700,
        orderType: 'BUY',
        status: 'EXECUTED',
      },
      {
        userId,
        security: 'MSFT',
        quantity: 40,
        executedQuantity: 0,
        price: 310,
        orderType: 'SELL',
        status: 'PENDING',
      },
      {
        userId,
        security: 'AMZN',
        quantity: 30,
        executedQuantity: 10,
        price: 3200,
        orderType: 'BUY',
        status: 'PARTIALLY_EXECUTED',
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log('Sample orders inserted.');
  } catch (error) {
    console.error('Error inserting orders:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

insertTestOrders();
