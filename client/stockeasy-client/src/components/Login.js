import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      const response = await axios.post('/api/login', formData);
      if (response.data.success) {
        // Store auth token and navigate to dashboard
        localStorage.setItem('authToken', response.data.token);
        navigate('/dashboard');
      } else if (response.data.error) {
        setError(response.data.error); // Display error from backend
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="left-panel">
        <h1>Welcome to StockEasy!</h1>
        <p>Trade Smarter, Live Better</p>
      </div>
      <div className="right-panel">
        <div className="login-form-container">
          <h2>Welcome Back!</h2>
          <p>Login to your account</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Your username or email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="btn-login">Log In</button>
          </form>
          
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <div className="redirect-text">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            <Link to="/" className="back-to-home">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
