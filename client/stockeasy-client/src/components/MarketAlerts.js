import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/stockeasy_logo.png';
import notificationIcon from '../assets/Notifcations Icon.png';
import profileIcon from '../assets/Profile Icon.png';
import './MarketAlerts.css';
import { fetchMarketNews } from '../services/alphaVantageAPI';

function MarketAlerts() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    username: '',
    email: '',
    age: '',
  });
    const [marketNews, setMarketNews] = useState([]);

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

    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                const news = await fetchMarketNews();
                setMarketNews(news);
            } catch (error) {
                console.error("Error fetching market news:", error);
            }
        };

        fetchNewsData();
    }, []);

    return (
        <div>
            {/* Primary Header */}
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="StockEasy Logo" />
                    <h3>StockEasy</h3>
                </div>
                <a href="./Dashboard" className="back-to-home">Back to Home</a>
            </header>

            {/* Secondary Header */}
            <div className="secondary-header">
                <nav className="navbar">
                    <a href="/portfolio">Portfolio</a>
                    <a href="/trade">Trade</a>
                    <a href="/learn">Learn</a>
                    <a href="/market-news" className="active">Market News</a>
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

            {/* Live Market News Heading */}
            <div className="market-alerts-container">
                <h2 className="live-market-news-heading">Live Market News</h2>

                {/* Live Market News Section */}
                <div className="live-market-news">
                    {marketNews.slice(0, 10).map((news, index) => (
                        <div key={index} className="news-card">
                            <div className="news-header">
                                <h4>{news.title}</h4>
                            </div>
                            <p className="news-summary">{news.summary}</p>
                            <div className="news-footer">
                                <span className="news-source">{news.source}</span>
                                <span className="news-time">{news.time}</span>
                           </div>
                           </div>
                    ))}
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

export default MarketAlerts;