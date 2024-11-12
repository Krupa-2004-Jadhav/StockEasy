import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/stockeasy_logo.png';
import notificationIcon from '../assets/Notifcations Icon.png';
import profileIcon from '../assets/Profile Icon.png';
import './TradeScreen.css';

function TradeScreen() {
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(null);
  const [action, setAction] = useState('Buy');
  const [orderType, setOrderType] = useState('Market');
  const [duration, setDuration] = useState('Day only');
  const [userMetrics, setUserMetrics] = useState({
    cash: 100000,
    buyingPower: 100000,
    accountValue: 100000,
  });

  // Fetch symbol suggestions as user types
  const fetchSymbolSuggestions = async (input) => {
    if (!input) return setSuggestions([]);
    try {
      const response = await fetch(`/trade/searchSymbol?keyword=${input}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching symbol suggestions:", error);
    }
  };

  // Handle symbol input change
  const handleSymbolChange = (e) => {
    const input = e.target.value.toUpperCase();
    setSymbol(input);
    fetchSymbolSuggestions(input);
  };

  // Select symbol from suggestions
  const handleSuggestionClick = (selectedSymbol) => {
    setSymbol(selectedSymbol);
    setSuggestions([]);
  };

  // Fetch stock price based on symbol
  const fetchStockData = async () => {
    if (!symbol) {
      alert('Please enter a stock symbol.');
      return;
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=KMSX9VTIBTKQ4AM2`
      );
      const data = await response.json();

      if (data['Time Series (5min)']) {
        const latestData = Object.values(data['Time Series (5min)'])[0];
        const fetchedPrice = parseFloat(latestData['1. open']).toFixed(2);
        setPrice(fetchedPrice);
        return fetchedPrice;
      } else {
        alert(data['Note'] || 'Stock symbol not found or API limit reached.');
        setPrice(null);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      alert('Failed to fetch stock data.');
    }
  };

  // Preview Order
  const handlePreviewOrder = () => {
    if (!symbol || quantity <= 0) {
      alert('Please enter a valid stock symbol and quantity.');
      return;
    }
    alert(
      `Order Preview:\nAction: ${action}\nSymbol: ${symbol}\nQuantity: ${quantity}\nPrice: Rs. ${price || 'Loading...'}\nOrder Type: ${orderType}\nDuration: ${duration}`
    );
  };

  // Submit Order
  const handleSubmitOrder = async () => {
    if (!symbol || quantity <= 0) {
      alert('Please enter a valid stock symbol and quantity.');
      return;
    }

    const endpoint = `/trade/${action.toLowerCase()}`;
    let userId = localStorage.getItem('userId');

    // Check if userId is set in localStorage
    if (!userId) {
      alert('User not logged in. Please log in and try again.');
      return;
    }

    try {
      // Ensure the price is fetched before submitting
      if (!price) {
        const fetchedPrice = await fetchStockData();
        if (!fetchedPrice) return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          stockSymbol: symbol,
          quantity,
          pricePerShare: price,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Order ${action} successful!`);
        setUserMetrics({
          cash: data.user.cash,
          buyingPower: data.user.buyingPower,
          accountValue: data.user.accountValue,
        });
      } else {
        alert(data.message || 'Error processing order.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again later.');
    }
  };

  return (
    <div>
      {/* Primary Header */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="StockEasy Logo" />
          <h3>StockEasy</h3>
        </div>
        <Link to="/dashboard" className="back-to-home">Back to Home</Link>
      </header>

      {/* Secondary Header */}
      <div className="secondary-header">
        <nav className="navbar">
          <a href="/portfolio">Portfolio</a>
          <a href="/trade" className="active">Trade</a>
          <a href="/learn">Learn</a>
          <a href="/market-news">Market News</a>
        </nav>
        <div className="header-icons">
          <img src={notificationIcon} alt="Notification" className="header-icon" />
          <img src={profileIcon} alt="Profile" className="header-icon" />
        </div>
      </div>

      {/* Trade Form */}
      <div className="trade-container">
        <div className="trade-card">
          <h3>Place Your Trade</h3>
          <div className="trade-form">
            <input
              type="text"
              placeholder="Enter Stock Symbol"
              value={symbol}
              onChange={handleSymbolChange}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(suggestion.symbol)}>
                    {suggestion.symbol} - {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
            <div className="trade-price">
              {price ? `Current Price: Rs. ${price}` : 'Enter symbol and click fetch to get price'}
            </div>
            <button onClick={fetchStockData}>Fetch Price</button>

            <select value={action} onChange={(e) => setAction(e.target.value)}>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
            />

            <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
              <option value="Market">Market</option>
              <option value="Limit">Limit</option>
            </select>

            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="Day only">Day only</option>
              <option value="Good till cancelled">Good till cancelled</option>
            </select>

            <button onClick={handlePreviewOrder}>Preview Order</button>
            <button onClick={handleSubmitOrder}>Submit Order</button>
          </div>
          <div className="trade-metrics">
            <h3>Portfolio Metrics</h3>
            <p>Cash: Rs. {userMetrics.cash}</p>
            <p>Buying Power: Rs. {userMetrics.buyingPower}</p>
            <p>Account Value: Rs. {userMetrics.accountValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradeScreen;
