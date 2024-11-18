const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./db'); // Ensure this path is correct for your database connection file
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const tradeRoutes = require('./routes/trade');
const { updateDailyMetrics } = require('./controllers/tradeControllers');

// Load environment variables
dotenv.config();

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in your .env file.');
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json()); // To parse JSON bodies
app.use(cors({
  origin: 'http://localhost:3000' ,
  allowedHeaders: ['Authorization', 'Content-Type']
}));

// Connect to MongoDB
connectDB().then(() => {
  console.log('MongoDB connected successfully.');
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Route setups
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/user', userRoutes); // User routes
app.use('/api/trade', tradeRoutes); // Trade routes

// Schedule daily metrics update at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily metrics update...');
  try {
    await updateDailyMetrics();
    console.log('Daily metrics updated successfully.');
  } catch (error) {
    console.error('Error updating daily metrics:', error.message);
  }
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal server error occurred.', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
