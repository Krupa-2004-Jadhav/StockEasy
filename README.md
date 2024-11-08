# StockEasy
StockEasy is a gamified stock learning platform aimed at the youth, designed to help users learn about the stock market, trade with virtual stocks, and compete with peers in a fun and interactive way. It combines educational resources, real-time stock data, and competitive elements to make stock market learning engaging and accessible.

## 🌟 Features
Landing Page: Introduction to StockEasy with signup/login options.
User Authentication: Secure user login and registration with JWT-based authentication.
Dashboard: Personalized dashboard displaying user statistics and market updates.
Learning Track: Educational content and quizzes to help users learn about stock trading and financial concepts.
Trading Track: Simulate stock trading with virtual money using real-time stock market data.
Portfolio Details: Track and manage virtual stock holdings and transactions.
Leaderboard: Compete with other users and track your rank based on your portfolio performance.
Market Alerts & Notifications: Stay updated with stock market alerts and personalized notifications.
Personal Milestones: Track progress and achievements as users complete learning modules and trading challenges.

## 🛠 Tech Stack
Frontend: React, React Router, Axios, Tailwind CSS (or Material UI)
Backend: Node.js, Express.js
Database: MongoDB (MongoDB Atlas)
API Integration: Stock Market API (Alpha Vantage, IEX Cloud, or Yahoo Finance)
Authentication: JWT (JSON Web Token)

## 📂 Project Structure
StockEasy/
├── client/          # React Frontend
│   ├── public/
│   └── src/
├── server/          # Node.js Backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── config/
├── database/        # MongoDB Configuration
├── .env             # Environment Variables
├── README.md
└── package.json

## 🚀 Getting Started
Follow these instructions to set up the project locally.

### Prerequisites
Node.js (v16 or higher)
MongoDB (Local instance or MongoDB Atlas)
Git

### Installation
Clone the Repository:
git clone https://github.com/your-username/StockEasy.git
cd StockEasy

### Install Dependencies:

#### Frontend:
cd client
npm install

#### Backend:
cd ../server
npm install

#### Set Up Environment Variables:
Create a .env file in the server/ directory with the following content:
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
STOCK_API_KEY=your-stock-api-key

#### Run the Application:
##### Start the frontend:
cd client
npm start

##### Start the backend:
cd ../server
npm run dev

#### Open in Browser:
Frontend: http://localhost:3000
Backend: http://localhost:5000

## 📈 API Endpoints
### User Authentication
POST /api/auth/register - Register a new user
POST /api/auth/login - Login with user credentials
### Stock Data
GET /api/stocks/data - Fetch real-time stock data
GET /api/portfolio/:userId - Get user portfolio details
POST /api/portfolio/update - Update user portfolio

## 📊 Database Schema
### User Model
{
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
}
### Portfolio Model
{
  userId: ObjectId,
  stocks: [
    {
      symbol: String,
      quantity: Number,
      averagePrice: Number,
    }
  ]
}
### Leaderboard Model
{
  userId: ObjectId,
  score: Number,
}

## 🧪 Testing
Frontend: Jest, React Testing Library
Backend: Jest, Supertest
Run tests:
npm test

## 🌐 Deployment
Frontend: Deployed on Vercel/Netlify
Backend: Deployed on Render/Heroku
Database: MongoDB Atlas

## 🔮 Future Scope
Implement advanced trading strategies and analytics.
Add social features like friend lists and user chat.
Integrate AI-driven stock recommendations.
Mobile application version (React Native).

## 🤝 Contribution
Contributions are welcome! Please follow the contributing guidelines and submit a pull request.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🛡️ Security
If you discover any security-related issues, please report them promptly.

### 📞 Contact
Project Maintainer: Kunjal Patwari
Email: patwarikunjal@gmail.com
