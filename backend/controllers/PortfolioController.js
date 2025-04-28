import Portfolio from "../models/Portfolio.js";

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
