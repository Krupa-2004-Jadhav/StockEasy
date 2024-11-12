const express = require('express');
const { getUserPortfolio } = require('../controllers/userControllers');
const { authenticateUser } = require('../middleware/authMiddleware'); // Authentication middleware
const router = express.Router();

// Protected route to get the user's portfolio
router.get('/portfolio', authenticateUser, getUserPortfolio);

module.exports = router;
