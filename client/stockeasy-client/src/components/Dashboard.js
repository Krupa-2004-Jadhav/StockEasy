import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/stockeasy_logo.png';
import notificationIcon from '../assets/Notifcations Icon.png';
import profileIcon from '../assets/Profile Icon.png';
import './Dashboard.css';

function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('1W');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div>
      {/* Primary Header */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="StockEasy Logo" />
          <h3>StockEasy</h3>
        </div>
        <Link to="/" className="back-to-home">Back to Home</Link>
      </header>

      {/* Secondary Header */}
      <div className="secondary-header">
        <nav className="navbar">
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/trade">Trade</Link>
          <Link to="/learn">Learn</Link>
          <Link to="/market-news">Market News</Link>
        </nav>
        <div className="header-icons">
          <img src={notificationIcon} alt="Notification" className="header-icon" />
          <img src={profileIcon} alt="Profile" className="header-icon" />
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-container">
        {/* Overview Section */}
        <div className="overview-section">
          <div className="overview-card">
            <h3>Account Value</h3>
            <p>Rs. 1,00,000</p>
          </div>
          <div className="overview-card">
            <h3>Today's Change</h3>
            <p style={{ color: '#00ff00' }}>+Rs. 0.00</p>
          </div>
          <div className="overview-card">
            <h3>Annual Return</h3>
            <p>0.00%</p>
          </div>
          <div className="overview-card">
            <h3>Buying Power</h3>
            <p>Rs. 1,00,000</p>
          </div>
        </div>

        {/* Performance Section */}
        <div className="performance-section">
          <div className="performance-tabs">
            {['1W', '1M', '3M', '6M', '1Y'].map((tab) => (
              <span
                key={tab}
                className={`performance-tab ${selectedTab === tab ? 'active' : ''}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="chart-placeholder">
            Your performance chart will update daily starting tomorrow
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
  );
}

export default Dashboard;
