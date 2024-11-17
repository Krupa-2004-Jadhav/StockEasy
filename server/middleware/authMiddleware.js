const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user via JWT
exports.authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, '268a015b0f9e3e973d5a6ffbad5d88d08ffa54a33f36ffcd3d49b7df4102a0792db69b956100390924eed1edb2b2de7d8035bca2a3bba42fd00d0e8956bbecbd');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
