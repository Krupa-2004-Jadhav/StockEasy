const express = require('express');
const { getUserDashboardData, getUserPortfolioData } = require('../controllers/userControllers');
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get user's dashboard data
router.get('/dashboard', authenticateUser, getUserDashboardData);

// Route to get user's portfolio data
router.get('/portfolio', authenticateUser, getUserPortfolioData);

module.exports = router;
