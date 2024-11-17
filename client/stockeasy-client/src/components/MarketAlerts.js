import React, { useState, useEffect } from 'react';
import logo from '../assets/stockeasy_logo.png';
import notificationIcon from '../assets/Notifcations Icon.png';
import profileIcon from '../assets/Profile Icon.png';
import './MarketAlerts.css';
import { fetchMarketNews } from '../services/alphaVantageAPI';

function MarketAlerts() {
    const [marketNews, setMarketNews] = useState([]);

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
                    <img src={profileIcon} alt="Profile" className="header-icon" />
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
        </div>
    );
}

export default MarketAlerts;