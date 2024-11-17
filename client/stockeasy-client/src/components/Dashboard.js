import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/stockeasy_logo.png';
import notificationIcon from '../assets/Notifcations Icon.png';
import profileIcon from '../assets/Profile Icon.png';
import './Dashboard.css';

function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('1W');
  const [dashboardData, setDashboardData] = useState({
    accountValue: 100000,
    todaysChange: 0,
    annualReturn: 0,
    buyingPower: 100000,
  });
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    username: '',
    email: '',
    age: '',
  });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Sidebar visibility state

  const userId = localStorage.getItem('userId');

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/user/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const { accountValue, buyingPower, todaysChange, annualReturn } = response.data;

        setDashboardData({
          accountValue,
          buyingPower,
          todaysChange,
          annualReturn,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch user details when sidebar is opened
  useEffect(() => {
    if (isSidebarVisible) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get('/api/user/details', {
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

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login'; // Redirect to login
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
          <img
            src={profileIcon}
            alt="Profile"
            className="header-icon"
            onClick={() => setIsSidebarVisible(!isSidebarVisible)} // Toggle sidebar visibility
          />
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-container">
        {/* Overview Section */}
        <div className="overview-section">
          <div className="overview-card">
            <h3>Account Value</h3>
            <p>Rs. {dashboardData.accountValue.toLocaleString()}</p>
          </div>
          <div className="overview-card">
            <h3>Today's Change</h3>
            <p style={{ color: dashboardData.todaysChange >= 0 ? '#00ff00' : '#ff0000' }}>
              {dashboardData.todaysChange >= 0 ? '+' : ''}
              Rs. {dashboardData.todaysChange.toLocaleString()}
            </p>
          </div>
          <div className="overview-card">
            <h3>Annual Return</h3>
            <p>{dashboardData.annualReturn.toFixed(2)}%</p>
          </div>
          <div className="overview-card">
            <h3>Buying Power</h3>
            <p>Rs. {dashboardData.buyingPower.toLocaleString()}</p>
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
}

export default Dashboard;
