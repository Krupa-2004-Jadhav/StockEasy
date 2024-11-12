const User = require('../models/User');
const { getCurrentStockPrice } = require('../utils/alphaVantage'); // Utility function to fetch stock prices

// Helper function to update portfolio metrics
const updatePortfolioMetrics = async (user) => {
  try {
    let holdingsValue = 0;

    // Calculate the current value of all holdings
    for (const holding of user.holdings) {
      const currentPrice = await getCurrentStockPrice(holding.stockSymbol);
      if (currentPrice === null) {
        console.error(`Failed to fetch price for ${holding.stockSymbol}`);
        continue;
      }
      holdingsValue += holding.quantity * currentPrice;
    }

    // Update user's account metrics
    user.accountValue = user.cash + holdingsValue;
    user.buyingPower = user.cash + holdingsValue * 0.5;
    user.annualReturn = ((user.accountValue - 100000) / 100000) * 100;

    await user.save();
  } catch (error) {
    console.error("Error updating portfolio metrics:", error);
  }
};

exports.buyStock = async (req, res) => {
  const { userId, stockSymbol, quantity, pricePerShare } = req.body;

  // Check if userId and other fields are provided
  if (!userId || !stockSymbol || !quantity || !pricePerShare) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await User.findById(userId);
  
  // Check if user exists
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.cash < quantity * pricePerShare) {
    return res.status(400).json({ message: "Insufficient cash to buy stocks" });
  }

  const existingHolding = user.holdings.find(h => h.stockSymbol === stockSymbol);
  const totalCost = quantity * pricePerShare;

  if (existingHolding) {
    const newQuantity = existingHolding.quantity + quantity;
    existingHolding.averagePrice = 
      ((existingHolding.averagePrice * existingHolding.quantity) + totalCost) / newQuantity;
    existingHolding.quantity = newQuantity;
  } else {
    user.holdings.push({ stockSymbol, quantity, averagePrice: pricePerShare });
  }

  user.cash -= totalCost;
  await user.save();
  res.json({ message: "Stock bought successfully", user });
};


// Controller function to handle selling stocks
exports.sellStock = async (req, res) => {
  const { userId, stockSymbol, quantity, pricePerShare } = req.body;

  // Validate input
  if (!userId || !stockSymbol || quantity <= 0 || pricePerShare <= 0) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingHolding = user.holdings.find(h => h.stockSymbol === stockSymbol);
    
    // Check if the user owns enough stock to sell
    if (!existingHolding || existingHolding.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient holdings to sell" });
    }

    const totalSale = quantity * pricePerShare;

    // Update holdings
    existingHolding.quantity -= quantity;
    if (existingHolding.quantity === 0) {
      user.holdings = user.holdings.filter(h => h.stockSymbol !== stockSymbol);
    }

    // Add cash from sale
    user.cash += totalSale;

    await updatePortfolioMetrics(user);
    res.json({ message: "Stock sold successfully", user });

  } catch (error) {
    console.error("Error selling stock:", error);
    res.status(500).json({ message: "Failed to sell stock" });
  }
};

// Daily metrics update function for cron job
exports.updateDailyMetrics = async () => {
  try {
    const users = await User.find();
    for (const user of users) {
      const previousAccountValue = user.accountValue;

      // Update portfolio metrics with current stock prices
      await updatePortfolioMetrics(user);

      // Calculate today's change
      user.todaysChange = user.accountValue - previousAccountValue;
      await user.save();
    }
  } catch (error) {
    console.error("Error updating daily metrics:", error);
  }
};
