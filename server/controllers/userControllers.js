// server/controllers/userController.js
const User = require('../models/User');

// Get user portfolio
exports.getUserPortfolio = async (req, res) => {
  try {
    // Assuming `req.userId` is set via middleware
    const user = await User.findById(req.userId).lean();
    
    // If user not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Include virtual fields in the response
    const { holdings, cash, accountValue, buyingPower, todaysChange, annualReturn } = user;
    
    res.json({
      holdings,
      cash,
      accountValue,
      buyingPower,
      todaysChange,
      annualReturn,
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ message: 'Error fetching portfolio data', error: error.message });
  }
};
