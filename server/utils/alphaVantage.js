const axios = require('axios');

// Function to get the current stock price
exports.getCurrentStockPrice = async (stockSymbol) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    throw new Error("Alpha Vantage API key is missing. Please set it in your environment variables.");
  }

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);

    // Check for HTML response (likely due to API rate limiting)
    if (response.headers['content-type'] && response.headers['content-type'].includes('text/html')) {
      throw new Error("Received HTML response, possibly due to API rate limiting.");
    }

    // Validate response structure
    if (response.data && response.data['Global Quote'] && response.data['Global Quote']['05. price']) {
      return parseFloat(response.data['Global Quote']['05. price']);
    } else {
      console.error("Unexpected response format:", response.data);
      throw new Error("Invalid response format from Alpha Vantage for stock price.");
    }
  } catch (error) {
    console.error("Error fetching stock price:", error.message || error);
    throw error;
  }
};

// Function to search for stock symbols
exports.searchSymbol = async (keyword) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    throw new Error("Alpha Vantage API key is missing. Please set it in your environment variables.");
  }

  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);

    // Check for HTML response (likely due to API rate limiting)
    if (response.headers['content-type'] && response.headers['content-type'].includes('text/html')) {
      throw new Error("Received HTML response, possibly due to API rate limiting.");
    }

    // Check if data is structured as expected
    if (response.data && response.data.bestMatches) {
      return response.data.bestMatches.map(match => ({
        symbol: match['1. symbol'],
        name: match['2. name']
      }));
    } else {
      console.error("Unexpected response format:", response.data);
      throw new Error("Invalid response format from Alpha Vantage for symbol search.");
    }
  } catch (error) {
    console.error("Error fetching symbol suggestions:", error.message || error);
    throw error;
  }
};
