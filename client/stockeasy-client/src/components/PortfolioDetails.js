import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/stockeasy_logo.png';
import notificationIcon from '../assets/Notifcations Icon.png';
import profileIcon from '../assets/Profile Icon.png';
import './PortfolioDetails.css';

const PortfolioDetails = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [accountValue, setAccountValue] = useState(100000);
  const [buyingPower, setBuyingPower] = useState(100000);
  const [cash, setCash] = useState(100000);
  const [annualReturn, setAnnualReturn] = useState(0);
  const [todayChange, setTodayChange] = useState(0);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      const data = [
        { symbol: 'AAPL', description: 'Apple Inc.', currentPrice: 150, todayChange: '+1.5%', purchasePrice: 130, qty: 10, totalValue: 1500, gainLoss: '+200' },
        { symbol: 'TSLA', description: 'Tesla Inc.', currentPrice: 700, todayChange: '-0.8%', purchasePrice: 650, qty: 5, totalValue: 3500, gainLoss: '+250' },
      ];
      setPortfolio(data);
    };

    fetchPortfolioData();
  }, []);

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
          <Link to="/portfolio" className="nav-link active">Portfolio</Link>
          <Link to="/trade" className="nav-link">Trade</Link>
          <Link to="/learn" className="nav-link">Learn</Link>
          <Link to="/market-news" className="nav-link">Market News</Link>
        </nav>
        <div className="header-icons">
          <img src={notificationIcon} alt="Notification" className="header-icon" />
          <img src={profileIcon} alt="Profile" className="header-icon" />
        </div>
      </div>

      {/* Main Container */}
      <div className="main-container">
        {/* Left Column: Holdings Section */}
        <div className="holdings-section">
          <h2>Stock & ETFs Holdings</h2>
          <div className="portfolio-container">
            <table className="portfolio-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Description</th>
                  <th>Current Price</th>
                  <th>Today's Change</th>
                  <th>Purchase Price</th>
                  <th>QTY</th>
                  <th>Total Value</th>
                  <th>Total Gain/Loss</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item, index) => (
                  <tr key={index}>
                    <td>{item.symbol}</td>
                    <td>{item.description}</td>
                    <td>{item.currentPrice}</td>
                    <td>{item.todayChange}</td>
                    <td>{item.purchasePrice}</td>
                    <td>{item.qty}</td>
                    <td>{item.totalValue}</td>
                    <td>{item.gainLoss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Account Overview Section */}
          <div className="overview-section">
            <div className="overview-card">
              <h3>Account Value</h3>
              <p>Rs. {accountValue.toLocaleString()}</p>
            </div>
            <div className="overview-card">
              <h3>Today's Change</h3>
              <p style={{ color: '#00ff00' }}>+Rs. {todayChange.toLocaleString()}</p>
            </div>
            <div className="overview-card">
              <h3>Annual Return</h3>
              <p>{annualReturn}%</p>
            </div>
            <div className="overview-card">
              <h3>Buying Power</h3>
              <p>Rs. {buyingPower.toLocaleString()}</p>
            </div>
            <div className="overview-card">
              <h3>Cash</h3>
              <p>Rs. {cash.toLocaleString()}</p>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="leaderboard-section">
            <h3>Leaderboard</h3>
            <div className="leaderboard-item">
              <span>Current Rank</span>
              <span>--</span>
            </div>
            <div className="leaderboard-item">
              <span>Top Player</span>
              <span>--</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetails;
