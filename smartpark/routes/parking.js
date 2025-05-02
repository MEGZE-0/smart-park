const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Joi = require('joi');

// Validation schemas
const parkingSpotSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  type: Joi.string().valid('indoor', 'street', 'valet').required(),
  available: Joi.boolean(),
  pricePerHour: Joi.number().min(0),
  amenities: Joi.array().items(Joi.string().valid('ev_charging', 'disabled_access', 'security', 'covered')),
});

const nearbySchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  type: Joi.string().valid('indoor', 'street', 'valet'),
  available: Joi.boolean(),
  radius: Joi.number().min(100),
  amenities: Joi.string(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
});

// Routes
router.post('/', auth, validate(parkingSpotSchema), parkingController.createParkingSpot);
router.post('/batch', auth, parkingController.batchUploadParkingSpots);
router.get('/', parkingController.getAllParkingSpots);
router.get('/:id', parkingController.getParkingSpot);
router.put('/:id', auth, validate(parkingSpotSchema), parkingController.updateParkingSpot);
router.delete('/:id', auth, parkingController.deleteParkingSpot);
router.get('/nearby', validate(nearbySchema), parkingController.getNearbyParkingSpots);
router.get('/distance/:id', validate(nearbySchema), parkingController.getDistanceToParkingSpot);
router.get('/history/:id', auth, parkingController.getParkingSpotHistory);

module.exports = router;