import Portfolio from "../models/Portfolio.js";
import jwt from 'jsonwebtoken';

export const updatePortfolio = async (userId, security, quantity, price) => {
    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
        const newPortfolio = new Portfolio({
            userId,
            holdings: [{
                security,
                quantity,
                averagePrice: price
            }]
        });
        await newPortfolio.save();
    } else {
        const existingHolding = portfolio.holdings.find(h => h.security === security);

        if (existingHolding) {
            const totalCost = (existingHolding.averagePrice * existingHolding.quantity) + (price * quantity);
            const totalQuantity = existingHolding.quantity + quantity;
            existingHolding.averagePrice = totalCost / totalQuantity;
            existingHolding.quantity = totalQuantity;
        } else {
            portfolio.holdings.push({
                security,
                quantity,
                averagePrice: price
            });
        }

        await portfolio.save();
    }
};



export const getPortfolioByUserId = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // You saved id in payload

    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    res.json({ success: true, portfolio });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


