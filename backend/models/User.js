
import mongoose from 'mongoose'


const UserSchema=new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email:{
        type: String,
        required:true,
        unique:true
    },

    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

     orders:[{
        userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          security: {
            type: String,
            required: true, // e.g., 'AAPL', 'GOOGL'
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
        
    }]
    
  });
  

  const User  = mongoose.models.user || mongoose.model('User',UserSchema)

  export default User