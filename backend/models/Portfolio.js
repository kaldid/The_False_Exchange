import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },


  holdings: [
    {
      security: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      averagePrice: {
        type: Number,
        required: true,
      },
    }
  ],

 });

const Portfolio=mongoose.model('Portfolio', portfolioSchema);

export default Portfolio
