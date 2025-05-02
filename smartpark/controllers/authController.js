const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    logger.info('User registered: ' + user.email);
    res.status(201).json({ token });
  } catch (error) {
    logger.error('Error registering user: ' + error.message);
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    logger.info('User logged in: ' + user.email);
    res.status(200).json({ token });
  } catch (error) {
    logger.error('Error logging in user: ' + error.message);
    next(error);
  }
};