const express = require('express');
const { 
    getUserDashboardData, 
    getUserPortfolioData, 
    getLeaderboardData  
  } = require('../controllers/userControllers');
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();
// Route to get user's dashboard data
router.get('/dashboard', authenticateUser, getUserDashboardData);

// Route to get user's portfolio data
router.get('/portfolio', authenticateUser, getUserPortfolioData);

// New leaderboard route
router.get('/leaderboard', authenticateUser, getLeaderboardData);

module.exports = router;
