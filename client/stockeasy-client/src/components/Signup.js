import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';


const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Form validation
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Check for required fields
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        formErrors[key] = 'This field is required';
        isValid = false;
      }
    });

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      formErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Validate age (should be a number and at least 18)
    if (isNaN(formData.age) || formData.age < 18) {
      formErrors.age = 'You must be at least 18 years old';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('/auth/signup', formData);
      if (response.data.success) {
        navigate('/dashboard');
      } else if (response.data.error === 'Username taken') {
        setErrors({ username: 'Username is already taken' });
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="left-panel">
        <h1>Welcome to StockEasy!</h1>
        <p>Trade Smarter, Live Better</p>
      </div>
      <div className="right-panel">
        <div className="signup-form-container">
          <h2>Join us!</h2>
          <p>Create a StockEasy account</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="error-text">{errors.fullName}</p>}

            <input
              type="text"
              name="username"
              placeholder="Your username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="error-text">{errors.username}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
            />
            {errors.age && <p className="error-text">{errors.age}</p>}

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

            <label className="terms-checkbox">
              <input type="checkbox" required />
              I agree to StockEasy's <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
            </label>

            <button type="submit" className="btn-signup">Sign Up</button>
          </form>

          <div className="redirect-text">
            <p>Already have an account? <Link to="/login">Log in</Link></p>
            <Link to="/" className="back-to-home">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
