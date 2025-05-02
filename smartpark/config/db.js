const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  let retries = 5;
  const delay = 5000; // 5 seconds

  while (retries) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info('MongoDB connected successfully!');
      console.log('MongoDB is ready on', process.env.MONGODB_URI);
      return;
    } catch (error) {
      retries -= 1;
      logger.error('Failed to connect to MongoDB: ' + error.message);
      console.error(
        'MongoDB connection failed! Attempts left: ' + retries + '. Retrying in ' + (delay / 1000) + ' seconds...'
      );
      if (!retries) {
        logger.error('MongoDB connection failed after all retries. Please check your MongoDB URL.');
        console.error(
          'ERROR: Could not connect to MongoDB. Ensure the MONGODB_URI in .env is correct.'
        );
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

module.exports = connectDB;