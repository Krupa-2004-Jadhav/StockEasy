const axios = require('axios');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || '268a015b0f9e3e973d5a6ffbad5d88d08ffa54a33f36ffcd3d49b7df4102a0792db69b956100390924eed1edb2b2de7d8035bca2a3bba42fd00d0e8956bbecbd';

router.post('/signup', async (req, res) => {
  try {
    const { fullName, username, email, age, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      username,
      email,
      age,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, '268a015b0f9e3e973d5a6ffbad5d88d08ffa54a33f36ffcd3d49b7df4102a0792db69b956100390924eed1edb2b2de7d8035bca2a3bba42fd00d0e8956bbecbd', { expiresIn: '1d' });
    axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
    res.status(201).json({ success: true, message: 'User created successfully',token });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: 'Error creating user', error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, '268a015b0f9e3e973d5a6ffbad5d88d08ffa54a33f36ffcd3d49b7df4102a0792db69b956100390924eed1edb2b2de7d8035bca2a3bba42fd00d0e8956bbecbd', { expiresIn: '1d' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;
