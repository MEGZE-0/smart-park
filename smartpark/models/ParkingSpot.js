const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  type: {
    type: String,
    enum: ['indoor', 'street', 'valet'],
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  pricePerHour: {
    type: Number,
    default: 0,
  },
  amenities: {
    type: [String],
    enum: ['ev_charging', 'disabled_access', 'security', 'covered'],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create 2dsphere index for geospatial queries
parkingSpotSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ParkingSpot', parkingSpotSchema);