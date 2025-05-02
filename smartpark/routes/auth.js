const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const Joi = require('joi');

// Validation schemas
const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Routes
router.post('/register', validate(authSchema), authController.register);
router.post('/login', validate(authSchema), authController.login);

module.exports = router;