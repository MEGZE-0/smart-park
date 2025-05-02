const ParkingSpot = require('../models/ParkingSpot');
const Reservation = require('../models/Reservation');
const Papa = require('papaparse');
const logger = require('../utils/logger');
const { Types } = require('mongoose');

// Create a new parking spot
exports.createParkingSpot = async (req, res, next) => {
  try {
    const { latitude, longitude, type, available, pricePerHour, amenities } = req.body;

    const parkingSpot = await ParkingSpot.create({
      location: { type: 'Point', coordinates: [longitude, latitude] },
      type,
      available: available !== undefined ? available : true,
      pricePerHour: pricePerHour || 0,
      amenities: amenities || [],
    });

    logger.info('Parking spot created: ' + parkingSpot._id);
    res.status(201).json(parkingSpot);
  } catch (error) {
    logger.error('Error creating parking spot: ' + error.message);
    next(error);
  }
};

// Batch upload parking spots via CSV
exports.batchUploadParkingSpots = async (req, res, next) => {
  try {
    const file = req.body.csvData;
    if (!file) {
      return res.status(400).json({ message: 'CSV data is required' });
    }

    const results = Papa.parse(file, { header: true }).data;
    const parkingSpots = results.map((row) => ({
      location: {
        type: 'Point',
        coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)],
      },
      type: row.type,
      available: row.available === 'true',
      pricePerHour: parseFloat(row.pricePerHour) || 0,
      amenities: row.amenities ? row.amenities.split(',') : [],
    }));

    const inserted = await ParkingSpot.insertMany(parkingSpots);
    logger.info('Batch uploaded ' + inserted.length + ' parking spots');
    res.status(201).json({ message: inserted.length + ' parking spots uploaded' });
  } catch (error) {
    logger.error('Error batch uploading parking spots: ' + error.message);
    next(error);
  }
};

// Get all parking spots with pagination and filtering
exports.getAllParkingSpots = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, amenities, minPrice, maxPrice } = req.query;

    const query = {};
    if (type) query.type = type;
    if (amenities) query.amenities = { $all: amenities.split(',') };
    if (minPrice || maxPrice) {
      query.pricePerHour = {};
      if (minPrice) query.pricePerHour.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerHour.$lte = parseFloat(maxPrice);
    }

    const parkingSpots = await ParkingSpot.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await ParkingSpot.countDocuments(query);

    const response = {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: parkingSpots,
    };

    logger.info('Parking spots fetched: ' + parkingSpots.length);
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error fetching parking spots: ' + error.message);
    next(error);
  }
};

// Get a specific parking spot by ID
exports.getParkingSpot = async (req, res, next) => {
  try {
    const parkingSpot = await ParkingSpot.findById(req.params.id);
    if (!parkingSpot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }
    logger.info('Parking spot fetched: ' + parkingSpot._id);
    res.status(200).json(parkingSpot);
  } catch (error) {
    logger.error('Error fetching parking spot: ' + error.message);
    next(error);
  }
};

// Update a parking spot
exports.updateParkingSpot = async (req, res, next) => {
  try {
    const { latitude, longitude, type, available, pricePerHour, amenities } = req.body;
    const updateData = {};
    if (latitude && longitude) {
      updateData.location = { type: 'Point', coordinates: [longitude, latitude] };
    }
    if (type) updateData.type = type;
    if (available !== undefined) updateData.available = available;
    if (pricePerHour !== undefined) updateData.pricePerHour = pricePerHour;
    if (amenities) updateData.amenities = amenities;

    const parkingSpot = await ParkingSpot.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!parkingSpot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }

    logger.info('Parking spot updated: ' + parkingSpot._id);
    // Notify clients via WebSocket (only if available changed)
    if (req.io && updateData.available !== undefined) {
      req.io.emit('parkingSpotUpdate', parkingSpot);
    }
    res.status(200).json(parkingSpot);
  } catch (error) {
    logger.error('Error updating parking spot: ' + error.message);
    next(error);
  }
};

// Delete a parking spot
exports.deleteParkingSpot = async (req, res, next) => {
  try {
    const parkingSpot = await ParkingSpot.findByIdAndDelete(req.params.id);
    if (!parkingSpot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }
    logger.info('Parking spot deleted: ' + parkingSpot._id);
    res.status(200).json({ message: 'Parking spot deleted' });
  } catch (error) {
    logger.error('Error deleting parking spot: ' + error.message);
    next(error);
  }
};

// Get nearby parking spots with advanced filtering
exports.getNearbyParkingSpots = async (req, res, next) => {
  try {
    const { lat, lng, type, available, radius = 5000, amenities, minPrice, maxPrice } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const query = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      },
    };

    if (type) query.type = type;
    if (available !== undefined) query.available = available === 'true';
    if (amenities) query.amenities = { $all: amenities.split(',') };
    if (minPrice || maxPrice) {
      query.pricePerHour = {};
      if (minPrice) query.pricePerHour.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerHour.$lte = parseFloat(maxPrice);
    }

    const parkingSpots = await ParkingSpot.find(query).limit(10);
    if (!parkingSpots.length) {
      return res.status(404).json({ message: 'No available parking spots found' });
    }

    logger.info('Nearby parking spots fetched: ' + parkingSpots.length);
    res.status(200).json(parkingSpots);
  } catch (error) {
    logger.error('Error fetching nearby parking spots: ' + error.message);
    next(error);
  }
};

// Calculate distance to a specific parking spot
exports.getDistanceToParkingSpot = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    const { id } = req.params;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const parkingSpot = await ParkingSpot.findById(id);
    if (!parkingSpot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }

    const [distanceResult] = await ParkingSpot.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: 'distance',
          spherical: true,
          query: { _id: Types.ObjectId(id) },
        },
      },
    ]);

    logger.info('Distance calculated for parking spot: ' + id);
    res.status(200).json({
      parkingSpot,
      distance: distanceResult.distance / 1000, // Convert to kilometers
    });
  } catch (error) {
    logger.error('Error calculating distance: ' + error.message);
    next(error);
  }
};

// Get parking spot usage history
exports.getParkingSpotHistory = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ parkingSpotId: req.params.id })
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .limit(50);

    logger.info('Parking spot history fetched: ' + req.params.id);
    res.status(200).json(reservations);
  } catch (error) {
    logger.error('Error fetching parking spot history: ' + error.message);
    next(error);
  }
};