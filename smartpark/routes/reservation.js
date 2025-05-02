const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Joi = require('joi');

// Validation schema
const reservationSchema = Joi.object({
  parkingSpotId: Joi.string().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
});

// Routes
router.post('/', auth, validate(reservationSchema), reservationController.createReservation);
router.delete('/:id', auth, reservationController.cancelReservation);
router.get('/', auth, reservationController.getUserReservations);

module.exports = router;