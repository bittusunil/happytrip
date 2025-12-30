# HappyTrip API Reference

Complete API documentation for HappyTrip backend.

## Base URL

```
Development: http://localhost:3001
Production: https://api.happytrip.com
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

## Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `500 Internal Server Error` - Server error

## Endpoints

### Authentication

#### Register
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Refresh Token
```
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Users

#### Get Profile
```
GET /users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "country": "Germany",
  "language": "en",
  "currency": "EUR",
  "emailVerified": true,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

#### Update Profile
```
PUT /users/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "country": "Germany"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "country": "Germany",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Update Preferences
```
PUT /users/:id/preferences
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "language": "de",
  "currency": "EUR"
}
```

**Response:**
```json
{
  "language": "de",
  "currency": "EUR"
}
```

### Flights

#### Search Flights
```
GET /flights/search?departure=BER&arrival=CDG&departureDate=2024-02-01&passengers=2&page=1&limit=10
```

**Query Parameters:**
- `departure` (required): Departure city code
- `arrival` (required): Arrival city code
- `departureDate` (required): Date in YYYY-MM-DD format
- `returnDate` (optional): Return date for round trip
- `passengers` (optional): Number of passengers (default: 1)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "_id": "flight_id",
      "flightNumber": "LH123",
      "airline": "Lufthansa",
      "aircraft": "Boeing 787",
      "departure": {
        "code": "BER",
        "city": "Berlin",
        "country": "Germany",
        "time": "2024-02-01T08:00:00Z"
      },
      "arrival": {
        "code": "CDG",
        "city": "Paris",
        "country": "France",
        "time": "2024-02-01T10:30:00Z"
      },
      "duration": 150,
      "stops": 0,
      "pricing": {
        "economy": 150.00,
        "business": 350.00,
        "firstClass": 750.00
      },
      "currency": "EUR",
      "availableSeats": {
        "economy": 45,
        "business": 12,
        "firstClass": 4
      },
      "amenities": ["WiFi", "Meals", "Entertainment"]
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "pages": 3
}
```

#### Get Flight Details
```
GET /flights/:id
```

**Response:**
```json
{
  "_id": "flight_id",
  "flightNumber": "LH123",
  "airline": "Lufthansa",
  "aircraft": "Boeing 787",
  "departure": {
    "code": "BER",
    "city": "Berlin",
    "country": "Germany",
    "time": "2024-02-01T08:00:00Z"
  },
  "arrival": {
    "code": "CDG",
    "city": "Paris",
    "country": "France",
    "time": "2024-02-01T10:30:00Z"
  },
  "duration": 150,
  "stops": 0,
  "pricing": {
    "economy": 150.00,
    "business": 350.00,
    "firstClass": 750.00
  },
  "currency": "EUR",
  "availableSeats": {
    "economy": 45,
    "business": 12,
    "firstClass": 4
  },
  "amenities": ["WiFi", "Meals", "Entertainment"]
}
```

#### Get Flights by Airline
```
GET /flights/airline/:airline
```

**Response:**
```json
{
  "data": [
    { /* flight objects */ }
  ],
  "total": 10,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

### Accommodations

#### Search Accommodations
```
GET /accommodations/search?city=Paris&checkInDate=2024-02-01&checkOutDate=2024-02-05&guests=2&page=1&limit=10
```

**Query Parameters:**
- `city` (required): City name
- `checkInDate` (required): Date in YYYY-MM-DD format
- `checkOutDate` (required): Date in YYYY-MM-DD format
- `guests` (optional): Number of guests (default: 1)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "_id": "accommodation_id",
      "name": "Hotel Paris",
      "type": "hotel",
      "description": "Luxury hotel in central Paris",
      "location": {
        "city": "Paris",
        "country": "France",
        "address": "123 Rue de Rivoli",
        "coordinates": {
          "latitude": 48.8566,
          "longitude": 2.3522
        }
      },
      "images": ["https://example.com/image1.jpg"],
      "rooms": {
        "total": 100,
        "available": 25,
        "types": ["Single", "Double", "Suite"]
      },
      "amenities": ["WiFi", "Pool", "Gym", "Restaurant"],
      "pricing": {
        "basePrice": 150.00,
        "currency": "EUR"
      },
      "rating": {
        "average": 4.5,
        "count": 250
      }
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

#### Get Accommodation Details
```
GET /accommodations/:id
```

**Response:**
```json
{
  "_id": "accommodation_id",
  "name": "Hotel Paris",
  "type": "hotel",
  "description": "Luxury hotel in central Paris",
  "location": {
    "city": "Paris",
    "country": "France",
    "address": "123 Rue de Rivoli",
    "coordinates": {
      "latitude": 48.8566,
      "longitude": 2.3522
    }
  },
  "images": ["https://example.com/image1.jpg"],
  "rooms": {
    "total": 100,
    "available": 25,
    "types": ["Single", "Double", "Suite"]
  },
  "amenities": ["WiFi", "Pool", "Gym", "Restaurant"],
  "pricing": {
    "basePrice": 150.00,
    "currency": "EUR"
  },
  "rating": {
    "average": 4.5,
    "count": 250
  }
}
```

#### Get Accommodations by City
```
GET /accommodations/city/:city
```

**Response:**
```json
{
  "data": [
    { /* accommodation objects */ }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

#### Get Accommodations by Type
```
GET /accommodations/type/:type
```

**Response:**
```json
{
  "data": [
    { /* accommodation objects */ }
  ],
  "total": 30,
  "page": 1,
  "limit": 10,
  "pages": 3
}
```

#### Get Accommodation Reviews
```
GET /accommodations/:id/reviews
```

**Response:**
```json
{
  "data": [
    {
      "_id": "review_id",
      "accommodationId": "accommodation_id",
      "userId": "user_id",
      "rating": 5,
      "title": "Amazing stay!",
      "comment": "Great location and friendly staff",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 250,
  "page": 1,
  "limit": 10,
  "pages": 25
}
```

#### Add Accommodation Review
```
POST /accommodations/:id/reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "title": "Amazing stay!",
  "comment": "Great location and friendly staff"
}
```

**Response:**
```json
{
  "_id": "review_id",
  "accommodationId": "accommodation_id",
  "userId": "user_id",
  "rating": 5,
  "title": "Amazing stay!",
  "comment": "Great location and friendly staff",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Bookings

#### Create Booking
```
POST /bookings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "flight",
  "referenceId": "flight_id",
  "totalPrice": 300.00,
  "currency": "EUR",
  "bookingDetails": {
    "passengers": 2,
    "cabinClass": "economy"
  },
  "checkInDate": "2024-02-01T08:00:00Z",
  "checkOutDate": "2024-02-05T10:30:00Z",
  "notes": "Special requests"
}
```

**Response:**
```json
{
  "id": "booking_id",
  "userId": "user_id",
  "type": "flight",
  "status": "pending",
  "referenceId": "flight_id",
  "totalPrice": 300.00,
  "currency": "EUR",
  "bookingDetails": {
    "passengers": 2,
    "cabinClass": "economy"
  },
  "checkInDate": "2024-02-01T08:00:00Z",
  "checkOutDate": "2024-02-05T10:30:00Z",
  "notes": "Special requests",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Get User Bookings
```
GET /bookings?page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "booking_id",
      "userId": "user_id",
      "type": "flight",
      "status": "confirmed",
      "referenceId": "flight_id",
      "totalPrice": 300.00,
      "currency": "EUR",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

#### Get Booking Details
```
GET /bookings/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "booking_id",
  "userId": "user_id",
  "type": "flight",
  "status": "confirmed",
  "referenceId": "flight_id",
  "totalPrice": 300.00,
  "currency": "EUR",
  "bookingDetails": {
    "passengers": 2,
    "cabinClass": "economy"
  },
  "checkInDate": "2024-02-01T08:00:00Z",
  "checkOutDate": "2024-02-05T10:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Get Booking by Reference
```
GET /bookings/reference/:referenceId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "booking_id",
  "userId": "user_id",
  "type": "flight",
  "status": "confirmed",
  "referenceId": "flight_id",
  "totalPrice": 300.00,
  "currency": "EUR"
}
```

#### Update Booking
```
PUT /bookings/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "notes": "Updated notes",
  "bookingDetails": {
    "passengers": 2,
    "cabinClass": "business"
  }
}
```

**Response:**
```json
{
  "id": "booking_id",
  "userId": "user_id",
  "type": "flight",
  "status": "confirmed",
  "referenceId": "flight_id",
  "totalPrice": 300.00,
  "currency": "EUR",
  "notes": "Updated notes",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

#### Update Booking Status
```
PUT /bookings/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Response:**
```json
{
  "id": "booking_id",
  "status": "confirmed",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

#### Cancel Booking
```
DELETE /bookings/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Booking cancelled successfully",
  "id": "booking_id",
  "status": "cancelled"
}
```

## Error Codes

| Code | Message | Status |
|------|---------|--------|
| `INVALID_CREDENTIALS` | Invalid email or password | 401 |
| `USER_EXISTS` | User already exists | 409 |
| `USER_NOT_FOUND` | User not found | 404 |
| `INVALID_TOKEN` | Invalid or expired token | 401 |
| `INSUFFICIENT_PERMISSIONS` | Insufficient permissions | 403 |
| `VALIDATION_ERROR` | Validation error | 400 |
| `FLIGHT_NOT_FOUND` | Flight not found | 404 |
| `ACCOMMODATION_NOT_FOUND` | Accommodation not found | 404 |
| `BOOKING_NOT_FOUND` | Booking not found | 404 |
| `BOOKING_ALREADY_CANCELLED` | Booking already cancelled | 409 |
| `INTERNAL_SERVER_ERROR` | Internal server error | 500 |

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time in Unix timestamp

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10, max: 100)

**Response:**
```json
{
  "data": [],
  "total": 100,
  "page": 1,
  "limit": 10,
  "pages": 10
}
```

## Filtering

Supported filter operators:
- `eq`: Equal
- `ne`: Not equal
- `gt`: Greater than
- `gte`: Greater than or equal
- `lt`: Less than
- `lte`: Less than or equal
- `in`: In array
- `nin`: Not in array

Example:
```
GET /flights/search?price[lte]=500&stops[eq]=0
```

## Sorting

Supported sort directions:
- `asc`: Ascending
- `desc`: Descending

Example:
```
GET /flights/search?sort=price:asc&sort=duration:asc
```

## Caching

- **Cache-Control**: public, max-age=300 (5 minutes)
- **ETag**: Provided for GET requests
- **Last-Modified**: Provided for GET requests

## CORS

- **Allowed Origins**: https://happytrip.com, https://www.happytrip.com
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization

## References

- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)
- [JWT Authentication](https://jwt.io/)

---

**API Version**: 1.0
**Last Updated**: January 2024
