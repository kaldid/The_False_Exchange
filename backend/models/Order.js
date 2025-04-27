import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    security: {
        type: String,
        required: true, 
    },
    quantity: {
        type: Number,
        required: true,
    },
    executedQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
    },
    orderType: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'PARTIALLY_EXECUTED', 'EXECUTED', 'CANCELLED'],
        default: 'PENDING',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
            

} , {timestamps : true})

const Order  = mongoose.models.order || mongoose.model('Order',OrderSchema)

export default Order