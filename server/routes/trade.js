const express = require('express');
const { buyStock, sellStock } = require('../controllers/tradeControllers');
const { searchSymbol } = require('../utils/alphaVantage');
const router = express.Router();

// Route for buying stock
router.post('/buy', buyStock);

// Route for selling stock
router.post('/sell', sellStock);

// Route to get symbol suggestions
router.get('/searchSymbol', async (req, res) => {
  const keyword = req.query.keyword;

  // Check if the keyword is provided
  if (!keyword) {
    return res.status(400).json({ message: 'Keyword query parameter is required' });
  }

  try {
    // Fetch suggestions
    const suggestions = await searchSymbol(keyword);
    res.json(suggestions);
  } catch (error) {
    console.error("Error fetching symbol suggestions:", error);
    res.status(500).json({ message: 'Error fetching symbol suggestions' });
  }
});

module.exports = router;
