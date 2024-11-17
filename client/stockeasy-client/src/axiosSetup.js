import axios from 'axios';

// Function to set up axios authentication
const setupAxiosAuth = () => {
  // Check for token on startup
  const token = localStorage.getItem('authToken');
  
  if (token) {
    // Set default authorization header
    axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
  }

  // Add request interceptor
  axios.interceptors.request.use(
    (config) => {
      // Get the latest token before each request
      const currentToken = localStorage.getItem('authToken');
      if (currentToken) {
        config.headers.authorization = `Bearer ${currentToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle token expiration
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle token expiration
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        // Redirect to login or handle as needed
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosAuth;