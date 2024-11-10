import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

// Import images directly
import logo from '../assets/stockeasy_logo.png';
import icon1 from '../assets/Landing_Icon1.png';
import icon2 from '../assets/Landing_Icon2.png';
import icon3 from '../assets/Landing_Icon3.png';
import instagramIcon from '../assets/instagram.png';
import linkedinIcon from '../assets/linkedin.png';


const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="StockEasy Logo" />
          <h3 >StockEasy</h3>
        </div>
        <nav className="nav">
          <Link to="/features">Features</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      {/* Main Section */}
      <main className="main-section">
        <h2>Trade Smarter, Live Better</h2>
        <p>Join StockEasy and start your journey to financial freedom.</p>
        <div className="buttons">
          <Link to="/login" className="btn btn-login">Login</Link>
          <Link to="/signup" className="btn btn-signup">Sign Up</Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="features">
        <div className="feature-item">
          <img src={icon1} alt="Trading Simulator" />
          <h3>Trading Simulator</h3>
          <p>Practice trading without risks using our state-of-the-art simulator.</p>
        </div>
        <div className="feature-item">
          <img src={icon2} alt="Market News" />
          <h3>Market News</h3>
          <p>Stay updated with the latest market trends and news.</p>
        </div>
        <div className="feature-item">
          <img src={icon3} alt="Portfolio Tracker" />
          <h3>Portfolio Tracker</h3>
          <p>Monitor your portfolio performance with detailed analytics.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
          <div className="social-icons">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" className="social-icon" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
            </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
