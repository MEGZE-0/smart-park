const Reservation = require('../models/Reservation');
const ParkingSpot = require('../models/ParkingSpot');
const logger = require('../utils/logger');

// Create a reservation
exports.createReservation = async (req, res, next) => {
  try {
    const { parkingSpotId, startTime, endTime } = req.body;
    const userId = req.user.id;

    const parkingSpot = await ParkingSpot.findById(parkingSpotId);
    if (!parkingSpot || !parkingSpot.available) {
      return res.status(400).json({ message: 'Parking spot not available' });
    }

    const reservation = await Reservation.create({
      userId,
      parkingSpotId,
      startTime,
      endTime,
    });

    // Update parking spot availability
    parkingSpot.available = false;
    await parkingSpot.save();

    logger.info('Reservation created: ' + reservation._id);
    // Notify clients via WebSocket
    if (req.io) {
      req.io.emit('parkingSpotUpdate', parkingSpot);
    }
    res.status(201).json(reservation);
  } catch (error) {
    logger.error('Error creating reservation: ' + error.message);
    next(error);
  }
};

// Cancel a reservation
exports.cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    // Update parking spot availability
    const parkingSpot = await ParkingSpot.findById(reservation.parkingSpotId);
    parkingSpot.available = true;
    await parkingSpot.save();

    logger.info('Reservation cancelled: ' + reservation._id);
    // Notify clients via WebSocket
    if (req.io) {
      req.io.emit('parkingSpotUpdate', parkingSpot);
    }
    res.status(200).json({ message: 'Reservation cancelled' });
  } catch (error) {
    logger.error('Error cancelling reservation: ' + error.message);
    next(error);
  }
};

// Get user reservations
exports.getUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .populate('parkingSpotId')
      .sort({ createdAt: -1 });

    logger.info('User reservations fetched for user: ' + req.user.id);
    res.status(200).json(reservations);
  } catch (error) {
    logger.error('Error fetching user reservations: ' + error.message);
    next(error);
  }
};