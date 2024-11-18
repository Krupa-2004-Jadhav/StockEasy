import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for sidebar and leaderboard
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    username: '',
    email: '',
    age: '',
  });
  const [leaderboardData, setLeaderboardData] = useState({
    currentRank: null,
    topUser: {
      username: '',
      accountValue: 0
    }
  });

  // Helper function to safely format currency
  const formatCurrency = (value) => {
    const safeValue = Number(value) || 0;
    return `Rs. ${safeValue.toLocaleString()}`;
  };

  // Fetch portfolio data from the backend API
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/user/portfolio', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const { holdings, accountValue, buyingPower, cash, todaysChange, annualReturn } = response.data;
  
        setPortfolio(holdings || []);
        setAccountValue(accountValue || 100000);
        setBuyingPower(buyingPower || 100000);
        setCash(cash || 100000);
        setAnnualReturn(annualReturn || 0);
        setTodayChange(todaysChange || 0);
        setError(null);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setError('Failed to load portfolio data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPortfolioData();
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/leaderboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const { currentRank, topUser } = response.data;
        setLeaderboardData({
          currentRank,
          topUser
        });
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  // Fetch user details when sidebar is opened
  useEffect(() => {
    if (isSidebarVisible) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/user/dashboard', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          const { fullName, username, email, age } = response.data;

          setUserDetails({ fullName, username, email, age });
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      fetchUserDetails();
    }
  }, [isSidebarVisible]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.clear();
    window.location.href = '/login';
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading portfolio details...</p>
      </div>
    );
  }

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
          <img
            src={profileIcon}
            alt="Profile"
            className="header-icon"
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="main-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {/* Left Column: Holdings Section */}
        <div className="holdings-section">
          <h2>Stock & ETFs Holdings</h2>
          {portfolio.length > 0 ? (
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
                      <td>{formatCurrency(item.currentPrice)}</td>
                      <td>{formatCurrency(item.todayChange)}</td>
                      <td>{formatCurrency(item.purchasePrice)}</td>
                      <td>{item.qty}</td>
                      <td>{formatCurrency(item.totalValue)}</td>
                      <td>{formatCurrency(item.gainLoss)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No holdings found in your portfolio.</p>
          )}
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Account Overview Section */}
          <div className="overview-section">
            <div className="overview-card">
              <h3>Account Value</h3>
              <p>{formatCurrency(accountValue)}</p>
            </div>
            <div className="overview-card">
              <h3>Today's Change</h3>
              <p style={{ color: todayChange >= 0 ? '#00ff00' : '#ff0000' }}>
                {todayChange >= 0 ? '+' : '-'}{formatCurrency(Math.abs(todayChange))}
              </p>
            </div>
            <div className="overview-card">
              <h3>Annual Return</h3>
              <p>{annualReturn}%</p>
            </div>
            <div className="overview-card">
              <h3>Buying Power</h3>
              <p>{formatCurrency(buyingPower)}</p>
            </div>
            <div className="overview-card">
              <h3>Cash</h3>
              <p>{formatCurrency(cash)}</p>
            </div>
          </div>

          {/* Enhanced Leaderboard Section */}
          <div className="leaderboard-section">
            <h3>Leaderboard</h3>
            <div className="leaderboard-item">
              <span>Your Rank</span>
              <span>{leaderboardData.currentRank || '--'}</span>
            </div>
            <div className="leaderboard-item">
              <span>Top Player</span>
              <span>
                {leaderboardData.topUser.username ? (
                  <>
                    {leaderboardData.topUser.username}
                    <br />
                    <small style={{ color: '#00ff00' }}>
                      Rs. {leaderboardData.topUser.accountValue.toLocaleString()}
                    </small>
                  </>
                ) : (
                  '--'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {isSidebarVisible && (
        <>
          <div className="sidebar-backdrop" onClick={() => setIsSidebarVisible(false)}></div>
          <div className="sidebar">
            <h3>Account Details</h3>
            {userDetails.fullName ? (
              <div className="sidebar-details">
                <p><strong>Full Name:</strong> {userDetails.fullName}</p>
                <p><strong>Username:</strong> {userDetails.username}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Age:</strong> {userDetails.age}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
            <button onClick={handleLogout} className="sidebar-btn">Logout</button>
            <button onClick={() => setIsSidebarVisible(false)} className="sidebar-btn close-btn">Close</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioDetails;