const User = require('../models/User');

// Helper function to calculate holdings value
const calculateHoldingsValue = (holdings) => {
  return holdings.reduce((acc, holding) => {
    return acc + holding.quantity * holding.currentPrice;
  }, 0);
};

// Controller to get dashboard data
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate account value (cash + holdings value)
    const holdingsValue = calculateHoldingsValue(user.holdings);
    const accountValue = user.cash + holdingsValue;
    const buyingPower = user.cash;

    // Prepare and send dashboard data response
    const dashboardData = {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      age: user.age,
      accountValue,
      buyingPower,
      todaysChange: user.todaysChange || 0,
      annualReturn: user.annualReturn || 0,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// Controller to get portfolio data
const getUserPortfolioData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate account value (cash + holdings value)
    const holdingsValue = calculateHoldingsValue(user.holdings);
    const accountValue = user.cash + holdingsValue;
    const buyingPower = user.cash;

    // Prepare and send portfolio data response
    const portfolioData = {
      holdings: user.holdings,
      accountValue,
      buyingPower,
      todaysChange: user.todaysChange || 0,
      annualReturn: user.annualReturn || 0,
    };

    res.status(200).json(portfolioData);
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

module.exports = {
  getUserDashboardData,
  getUserPortfolioData,
};
