# SmartPark Dependencies

## Dependencies

### **bcryptjs** (^2.4.3)
- **What it does**: Encrypts passwords to store them securely.
- **Use in SmartPark**: Hashes user passwords in `User.js` for secure registration and login (`POST /auth/register`, `POST /auth/login`).
- **Relation to Requirements**: Not required but supports user authentication—an enhancement for secure CRUD operations.

---

### **dotenv** (^16.4.5)
- **What it does**: Loads environment variables (e.g., `MONGODB_URI`, `JWT_SECRET`) from a `.env` file.
- **Use in SmartPark**: Reads `MONGODB_URI` for MongoDB connection and `JWT_SECRET` for authentication in `app.js`.
- **Relation to Requirements**: Supports MongoDB connection, essential for storing `ParkingSpot` data.

---

### **express** (^4.21.0)
- **What it does**: A web framework to create APIs, handle HTTP requests, and define routes.
- **Use in SmartPark**: Powers the entire API, handling endpoints like `POST /parking`, `GET /parking/nearby`, etc., in `app.js` and `routes/*`.
- **Relation to Requirements**: **Core requirement** for building the RESTful API with Node.js.

---

### **express-rate-limit** (^7.4.0)
- **What it does**: Limits the number of requests from an IP to prevent abuse.
- **Use in SmartPark**: Applied in `middleware/rateLimiter.js` to allow 100 requests per 15 minutes.
- **Relation to Requirements**: Not required but enhances security for production use.

---

### **helmet** (^7.1.0)
- **What it does**: Adds security headers to HTTP responses to protect against attacks.
- **Use in SmartPark**: Used in `app.js` to secure API responses (e.g., prevents XSS attacks).
- **Relation to Requirements**: Not required but improves API security.

---

### **joi** (^17.13.3)
- **What it does**: Validates input data to ensure it’s correct before processing.
- **Use in SmartPark**: Validates request bodies in `routes/parking.js`, `routes/auth.js`, and `routes/reservation.js` (e.g., checks latitude, type, amenities).
- **Relation to Requirements**: Not required but ensures valid data for CRUD operations and geospatial queries.

---

### **jsonwebtoken** (^9.0.2)
- **What it does**: Creates and verifies JSON Web Tokens (JWT) for user authentication.
- **Use in SmartPark**: Generates tokens in `authController.js` for `/auth/register` and `/auth/login`, verified in `middleware/auth.js` for protected endpoints.
- **Relation to Requirements**: Not required but supports secure access to CRUD endpoints.

---

### **mongoose** (^8.7.0)
- **What it does**: Connects to MongoDB and defines data models/schemas.
- **Use in SmartPark**: Defines `ParkingSpot`, `User`, and `Reservation` models in `models/*`, connects to MongoDB in `config/db.js`, and supports geospatial indexing (`2dsphere`).
- **Relation to Requirements**: **Core requirement** for MongoDB integration, `ParkingSpot` model, and geospatial queries.

---

### **morgan** (^1.10.0)
- **What it does**: Logs HTTP requests (e.g., which endpoints are called).
- **Use in SmartPark**: Logs requests in `app.js` to the console and `combined.log` via `logger.js`.
- **Relation to Requirements**: Not required but helps debug API usage.

---

### **papaparse** (^5.4.1)
- **What it does**: Parses CSV files into JavaScript objects.
- **Use in SmartPark**: Used in `parkingController.js` for `POST /parking/batch` to upload multiple parking spots from CSV.
- **Relation to Requirements**: Not required but supports batch uploading, an enhancement.

---

### **socket.io** (^4.7.5)
- **What it does**: Enables real-time communication using WebSockets.
- **Use in SmartPark**: Sends real-time updates in `parkingController.js` and `reservationController.js` when parking spot availability changes.
- **Relation to Requirements**: Not required but enhances user experience with live updates.

---

### **swagger-jsdoc** (^6.2.8)
- **What it does**: Generates Swagger documentation from JSDoc comments.
- **Use in SmartPark**: Used in `config/swagger.js` to define API metadata for Swagger UI.
- **Relation to Requirements**: Not required but improves developer experience with documentation.

---

### **swagger-ui-express** (^5.0.1)
- **What it does**: Serves Swagger UI to visualize and test API endpoints.
- **Use in SmartPark**: Displays API docs at `http://localhost:3000/api-docs` in `app.js`.
- **Relation to Requirements**: Not required but makes testing endpoints easier.

---

### **winston** (^3.14.2)
- **What it does**: Logs application events (e.g., errors, info) to files or console.
- **Use in SmartPark**: Logs API activity in `utils/logger.js` to `error.log` and `combined.log`.
- **Relation to Requirements**: Not required but aids debugging and monitoring.

---

## DevDependencies

### **nodemon** (^3.1.7)
- **What it does**: Restarts the server automatically when code changes.
- **Use in SmartPark**: Runs the app in development mode with `npm run dev`.
- **Relation to Requirements**: Not required but speeds up development.
