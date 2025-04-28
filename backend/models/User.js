
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

    orders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'  
    }]
    
  });
  

  const User  = mongoose.models.user || mongoose.model('User',UserSchema)

  export default User
