const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const parkingRoutes = require('./routes/parking');
const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservation');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for development
  },
});

// Connect to MongoDB
connectDB().catch((err) => {
  console.error('Failed to start app due to MongoDB connection error:', err.message);
  process.exit(1);
});

// Middleware
app.use(helmet());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(express.json());
app.use(rateLimiter);

// Swagger UI
const swaggerDocument = YAML.load('./docs/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
  };
  res.status(200).json(health);
});

// Routes
app.use('/auth', authRoutes);
app.use('/parking', (req, res, next) => {
  req.io = io;
  next();
}, parkingRoutes);
app.use('/reservations', (req, res, next) => {
  req.io = io;
  next();
}, reservationRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info('Server running on port ' + PORT);
  console.log('API is running at http://localhost:' + PORT);
  console.log('Swagger UI at http://localhost:' + PORT + '/api-docs');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Closing server...');
  server.close(() => {
    mongoose.connection.close(() => {
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  });
});