import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/stockeasy_logo.png';
import notificationIcon from '../assets/Notifcations Icon.png';
import profileIcon from '../assets/Profile Icon.png';
import iconGetting from '../assets/Learn_getting.png';
import iconIntroduction from '../assets/Learn_introduction.png';
import iconTrading from '../assets/Learn_trading.png';
import iconManaging from '../assets/Learn_managing.png';
import './LearningTrack.css';

function LearningTrack() {
    const [selectedCategory, setSelectedCategory] = useState('Getting started guide');
    const [selectedVideo, setSelectedVideo] = useState('https://www.youtube.com/embed/sampleX');
  
    const categories = [
      { name: 'Getting started guide', icon: iconGetting, videos: [{ title: 'How to buy a stock', url: 'https://www.youtube.com/embed/p7HKvqRI_Bo', duration: '1:02' }] },
      { name: 'Introduction to stocks', icon: iconIntroduction, videos: [{ title: 'Stock Research', url: 'https://www.youtube.com/embed/sampleY', duration: '2:15' }] },
      { name: 'Stock trading basics', icon: iconTrading, videos: [{ title: 'How to buy a call option', url: 'https://www.youtube.com/embed/sampleZ', duration: '1:02' }] },
      { name: 'Managing portfolio', icon: iconManaging, videos: [{ title: 'Managing risk', url: 'https://www.youtube.com/embed/sampleW', duration: '3:05' }] }
    ];
  
    const handleCategoryClick = (category) => {
      setSelectedCategory(category.name);
      setSelectedVideo(category.videos[0].url);
    };
  
    const handleVideoClick = (videoUrl) => {
      setSelectedVideo(videoUrl);
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
            <a href="/trade">Trade</a>
            <a href="/learn" className="active">Learn</a>
            <a href="/market-news">Market News</a>
          </nav>
          <div className="header-icons">
            <img src={notificationIcon} alt="Notification" className="header-icon" />
            <img src={profileIcon} alt="Profile" className="header-icon" />
          </div>
        </div>

        <div className="learning-track-container">
          <div className="categories">
            {categories.map((category) => (
              <div
                key={category.name}
                className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                <img src={category.icon} alt={category.name} />
                <span>{category.name}</span>
              </div>
            ))}
          </div>

          <div className="video-section">
            <div className="main-video">
              <iframe
                src={selectedVideo}
                title="Selected Video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <div className="video-title">Videos on {selectedCategory}</div>
            </div>

            <div className="playlist">
              {categories
                .find((category) => category.name === selectedCategory)
                .videos.map((video, index) => (
                  <div
                    key={index}
                    className={`video-item ${selectedVideo === video.url ? 'active' : ''}`}
                    onClick={() => handleVideoClick(video.url)}
                  >
                    <img src={`https://img.youtube.com/vi/${video.url.split('/').pop()}/0.jpg`} alt={video.title} className="video-thumbnail" />
                    <div className="video-info">
                      <h4>{video.title}</h4>
                      <p>{video.duration}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
}

export default LearningTrack;
