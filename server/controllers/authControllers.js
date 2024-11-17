// authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  //console.log("Request body received at login endpoint:", req.body);
  const { email, password } = req.body;
  //console.log("Received login request with body:", req.body); // Log the incoming request

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if JWT_SECRET is configured
    if (!'268a015b0f9e3e973d5a6ffbad5d88d08ffa54a33f36ffcd3d49b7df4102a0792db69b956100390924eed1edb2b2de7d8035bca2a3bba42fd00d0e8956bbecbd') {
      console.error('JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, '268a015b0f9e3e973d5a6ffbad5d88d08ffa54a33f36ffcd3d49b7df4102a0792db69b956100390924eed1edb2b2de7d8035bca2a3bba42fd00d0e8956bbecbd', { expiresIn: '1d' });
    //console.log("Token generated for user:", email);

    // Respond with the token
    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
