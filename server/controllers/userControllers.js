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
    const userId = req.userId;
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

// New leaderboard controller function
const getLeaderboardData = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all users and calculate their account values in a single aggregation pipeline
    const users = await User.aggregate([
      {
        $project: {
          username: 1,
          cash: 1,
          holdings: 1,
          createdAt: 1,
          // Calculate total holdings value
          holdingsValue: {
            $reduce: {
              input: '$holdings',
              initialValue: 0,
              in: {
                $add: [
                  '$$value',
                  { $multiply: ['$$this.quantity', '$$this.currentPrice'] }
                ]
              }
            }
          }
        }
      },
      {
        $addFields: {
          accountValue: { $add: ['$cash', '$holdingsValue'] }
        }
      },
      {
        $sort: {
          accountValue: -1,
          createdAt: 1
        }
      }
    ]);

    // Find top user
    const topUser = users.length > 0 ? {
      username: users[0].username,
      accountValue: users[0].accountValue
    } : {
      username: 'No users yet',
      accountValue: 0
    };

    // Find current user's rank
    const currentUserRank = users.findIndex(user => 
      user._id.toString() === userId.toString()
    ) + 1;

    // Get top 10 users for the leaderboard
    const topUsers = users.slice(0, 10).map(user => ({
      username: user.username,
      accountValue: user.accountValue
    }));

    res.json({
      currentRank: currentUserRank || '--',
      topUser,
      totalUsers: users.length,
      leaderboard: topUsers
    });

  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    res.status(500).json({ 
      message: 'Failed to fetch leaderboard data',
      error: error.message 
    });
  }
};

module.exports = {
  getUserDashboardData,
  getUserPortfolioData,
  getLeaderboardData
};
