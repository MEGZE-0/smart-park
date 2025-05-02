# SmartPark API Routes

This document lists all API routes for the SmartPark application, explaining what each does in simple terms.

## Auth Routes
| Route | Description |
|-------|-------------|
| **POST /auth/register** | Signs up a new user, returns a token. *Ex*: `{"email": "test@example.com", "password": "password123"}` |
| **POST /auth/login** | Logs in a user, returns a token. *Ex*: Same as above |

## Parking Routes
| Route | Description |
|-------|-------------|
| **POST /parking** (Needs token) | Adds a new parking spot. *Ex*: `{"latitude": 40.7128, "longitude": -74.0060, "type": "street"}` |
| **POST /parking/batch** (Needs token) | Adds multiple spots from CSV. *Ex*: Send CSV data |
| **GET /parking** | Lists all parking spots. *Ex*: `?page=1&type=street` for street spots |
| **GET /parking/:id** | Shows one parking spot. *Ex*: `/parking/123` for spot ID `123` |
| **PUT /parking/:id** (Needs token) | Updates a spot. *Ex*: `/parking/123` with `{"available": false}` |
| **DELETE /parking/:id** (Needs token) | Deletes a spot. *Ex*: `/parking/123` removes spot `123` |
| **GET /parking/nearby** | Finds nearby spots. *Ex*: `?lat=40.7128&lng=-74.0060&available=true` |
| **GET /parking/distance/:id** | Shows distance to a spot. *Ex*: `/parking/distance/123?lat=40.7128&lng=-74.0060` |
| **GET /parking/history/:id** (Needs token) | Shows spot’s reservation history. *Ex*: `/parking/history/123` |

## Reservation Routes
| Route | Description |
|-------|-------------|
| **POST /reservations** (Needs token) | Books a parking spot. *Ex*: `{"parkingSpotId": "123", "startTime": "2025-05-02T10:00"}` |
| **DELETE /reservations/:id** (Needs token) | Cancels a booking. *Ex*: `/reservations/456` cancels booking `456` |
| **GET /reservations** (Needs token) | Lists user’s bookings. *Ex*: Shows all user reservations |

## Health Route
| Route | Description |
|-------|-------------|
| **GET /health** | Checks if API is running. *Ex*: Returns `{"status": "ok"}` |

## Notes
- **Required Routes**: Includes all needed routes for CRUD (`POST /parking`, `GET /parking`, etc.), nearby spots (`GET /parking/nearby`), and distance (`GET /parking/distance/:id`).
- **Extra Routes**: Added auth, reservations, batch upload, history, and health check for a complete parking app.
- **Protected Routes**: Routes marked “Needs token” require `Authorization: Bearer <token>` from `/auth/login`.
- **Testing**: Use Swagger UI at `http://localhost:3000/api-docs` to try these routes.