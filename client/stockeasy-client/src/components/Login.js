import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if the user is already logged in
  const token = localStorage.getItem('authToken');

  // If already authenticated, show a button to go to dashboard
  if (token) {
    return (
      <div className="login-page">
        <div className="left-panel">
          <h1>You are already logged in!</h1>
          <button onClick={() => navigate('/dashboard')} className="btn-login">
            Go to Dashboard
          </button>
          <Link to="/" className="back-to-home">Back to Home</Link>
        </div>
      </div>
    );
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/auth/login', formData);

      if (response.status === 200 && response.data.token) {
        // Store auth token and decode to extract user_id
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        
        const decodedToken = jwtDecode(token); // Decode the token
        const userId = decodedToken.user_id; // Extract user ID
        localStorage.setItem('userId', userId); // Store user ID for use in the app

        navigate('/dashboard');
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
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
              placeholder="Your email"
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
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
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
