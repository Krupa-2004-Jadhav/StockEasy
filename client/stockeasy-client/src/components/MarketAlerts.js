import React, { useState, useEffect } from 'react';
import logo from '../assets/stockeasy_logo.png';
import notificationIcon from '../assets/Notifcations Icon.png';
import profileIcon from '../assets/Profile Icon.png';
import './MarketAlerts.css';
/*import { fetchMarketNews } from '../services/alphaVantageAPI';*/


function MarketAlerts() {
    const [stockData, setStockData] = useState([]);
    const [marketNews, setMarketNews] = useState([]);

    useEffect(() => {
        // Sample stock data for market alert section
        setStockData([
            {
                symbol: 'CABO',
                name: 'Cable One, Inc.',
                price: 402.57,
                change: '+4.62% (17.80)',
                chartImg: '../assets/chart-cabo.png'
            },
            {
                symbol: 'MO',
                name: 'Altria Group, Inc.',
                price: 54.05,
                change: '+0.95% (0.51)',
                chartImg: '../assets/chart-mo.png'
            },
            {
                symbol: 'TSLA',
                name: 'Tesla, Inc.',
                price: 321.22,
                change: '+8.19% (24.31)',
                chartImg: '../assets/chart-tsla.png'
            }
        ]);

        // Sample news data
        setMarketNews([
            {
                title: 'Federal Reserve Raises Interest Rates by 0.25%',
                summary: 'The Federal Reserve announced a quarter-point increase in interest rates to curb inflation.',
                source: 'Bloomberg',
                time: '2 hours ago',
                type: '🚨 Urgent',
                impactGraph: '../assets/graph-interest-rate.png'
            },
            {
                title: 'Tech Stocks Rally Amid AI Advancements',
                summary: 'Major tech companies saw significant gains after announcing new AI developments.',
                source: 'Reuters',
                time: '1 hour ago',
                type: '💹 Bullish',
                impactGraph: '../assets/graph-tech-rally.png'
            }
        ]);
    }, []);

    return (
        <div>
            {/* Primary Header */}
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="StockEasy Logo" />
                    <h3>StockEasy</h3>
                </div>
                <a href="/dashboard" className="back-to-home">Back to Home</a>
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

            {/* Market Alerts Section */}
            <div className="market-alerts-container">
                <div className="symbol-lookup">
                    <input type="text" placeholder="Symbol Lookup" />
                </div>

                <div className="market-section">
                    <h2>Most Traded Stocks</h2>
                    <div className="stock-cards">
                        {stockData.map((stock, index) => (
                            <div key={index} className="stock-card">
                                <h2>{stock.symbol}</h2>
                                <p>{stock.name}</p>
                                <p className="price">{stock.price} USD</p>
                                <p className="change">{stock.change}</p>
                                <img src={stock.chartImg} alt={`Chart for ${stock.symbol}`} width="100%" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Market News Section */}
                <div className="live-market-news">
                    <h3>Live Market News</h3>
                    {marketNews.map((news, index) => (
                        <div key={index} className="news-card">
                            <div className="news-header">
                                <span className="news-type">{news.type}</span>
                                <h4>{news.title}</h4>
                            </div>
                            <p className="news-summary">{news.summary}</p>
                            <div className="news-footer">
                                <span className="news-source">{news.source}</span>
                                <span className="news-time">{news.time}</span>
                            </div>
                            <img src={news.impactGraph} alt={`Impact graph for ${news.title}`} className="news-graph" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MarketAlerts;