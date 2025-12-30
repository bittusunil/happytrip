# Phase 1: Project Initialization & Backend Setup

## Overview

This phase establishes the foundation of the HappyTrip travel application by setting up the project structure, backend infrastructure, and core modules.

## What Was Done

### 1. Project Structure
- Created monorepo structure with separate `backend` and `frontend` directories
- Set up Git repository with proper `.gitignore` configuration
- Configured Docker Compose for PostgreSQL and MongoDB

### 2. Backend Setup (NestJS)

#### Dependencies Installed
- **Core**: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- **Database**: `@nestjs/typeorm`, `typeorm`, `pg`, `@nestjs/mongoose`, `mongoose`
- **Authentication**: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `passport-local`
- **Utilities**: `bcrypt`, `class-validator`, `class-transformer`, `nodemailer`
- **Documentation**: `@nestjs/swagger`

#### Module Architecture

```
Backend (NestJS)
├── Auth Module
│   ├── JWT Strategy
│   ├── Local Strategy
│   ├── Auth Service
│   └── Auth Controller
├── Users Module
│   ├── User Entity (PostgreSQL)
│   ├── Users Service
│   └── Users Controller
├── Flights Module
│   ├── Flight Schema (MongoDB)
│   ├── Flights Service
│   └── Flights Controller
├── Accommodations Module
│   ├── Accommodation Schema (MongoDB)
│   ├── Review Schema (MongoDB)
│   ├── Accommodations Service
│   └── Accommodations Controller
└── Bookings Module
    ├── Booking Entity (PostgreSQL)
    ├── Bookings Service
    └── Bookings Controller
```

### 3. Database Configuration

#### PostgreSQL (TypeORM)
Used for transactional data:
- **Users**: User accounts with authentication
- **Bookings**: Flight and accommodation bookings
- **Transactions**: Payment and booking history

**Connection Details**:
```
Host: localhost
Port: 5432
Database: happytrip_db
User: happytrip
Password: happytrip_password
```

#### MongoDB (Mongoose)
Used for document-based data:
- **Flights**: Flight listings with pricing and availability
- **Accommodations**: Hotel/apartment listings with amenities
- **Reviews**: User reviews and ratings

**Connection Details**:
```
URI: mongodb://happytrip:happytrip_password@localhost:27017/happytrip_db?authSource=admin
```

### 4. Authentication System

#### Features
- Email/password registration and login
- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- User profile management
- Language and currency preferences

#### Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

### 5. Core Entities & Schemas

#### User Entity (PostgreSQL)
```typescript
- id: UUID (Primary Key)
- email: String (Unique)
- firstName: String
- lastName: String
- password: String (Hashed)
- phoneNumber: String (Optional)
- profileImage: String (Optional)
- language: String (Default: 'en')
- currency: String (Default: 'EUR')
- country: String (Optional)
- emailVerified: Boolean
- isActive: Boolean
- createdAt: Timestamp
- updatedAt: Timestamp
```

#### Flight Schema (MongoDB)
```typescript
- flightNumber: String (Unique)
- airline: String
- departure: Object { airport, code, time, terminal }
- arrival: Object { airport, code, time, terminal }
- aircraft: String
- duration: Number (minutes)
- stops: Number
- availableSeats: Object { economy, business, firstClass }
- pricing: Object { economy, business, firstClass }
- currency: String (Default: 'EUR')
- amenities: Array
- isActive: Boolean
```

#### Accommodation Schema (MongoDB)
```typescript
- name: String
- description: String
- type: Enum { hotel, apartment, villa, cottage, resort, hostel }
- location: Object { address, city, country, latitude, longitude }
- images: Array
- amenities: Array
- rooms: Object { total, available, types }
- pricing: Object { basePrice, currency, seasonalPrices }
- rating: Object { average, count }
- policies: Object { checkInTime, checkOutTime, cancellation, minStay }
- owner: Object { id, name, email }
- isActive: Boolean
```

#### Booking Entity (PostgreSQL)
```typescript
- id: UUID (Primary Key)
- userId: UUID (Foreign Key)
- type: Enum { flight, accommodation }
- status: Enum { pending, confirmed, cancelled, completed }
- referenceId: String
- totalPrice: Decimal
- currency: String (Default: 'EUR')
- bookingDetails: JSONB
- checkInDate: Timestamp (Optional)
- checkOutDate: Timestamp (Optional)
- notes: String (Optional)
- createdAt: Timestamp
- updatedAt: Timestamp
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh token

### Users
- `GET /users/profile` - Get current user profile
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile
- `PUT /users/:id/preferences` - Update language/currency
- `DELETE /users/:id` - Delete account
- `PUT /users/:id/deactivate` - Deactivate account

### Flights
- `GET /flights/search` - Search flights
- `GET /flights/:id` - Get flight details
- `GET /flights/airline/:airline` - Get flights by airline
- `POST /flights` - Create flight (Admin)
- `PUT /flights/:id` - Update flight (Admin)
- `DELETE /flights/:id` - Delete flight (Admin)

### Accommodations
- `GET /accommodations/search` - Search accommodations
- `GET /accommodations/:id` - Get accommodation details
- `GET /accommodations/city/:city` - Get by city
- `GET /accommodations/type/:type` - Get by type
- `POST /accommodations` - Create accommodation
- `PUT /accommodations/:id` - Update accommodation
- `DELETE /accommodations/:id` - Delete accommodation
- `POST /accommodations/:id/reviews` - Add review
- `GET /accommodations/:id/reviews` - Get reviews

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `GET /bookings/:id` - Get booking details
- `GET /bookings/reference/:referenceId` - Get by reference
- `PUT /bookings/:id` - Update booking
- `PUT /bookings/:id/status` - Update status
- `PUT /bookings/:id/cancel` - Cancel booking
- `DELETE /bookings/:id` - Delete booking

## Environment Variables

Create `.env` file in the `backend` directory:

```env
# Application
NODE_ENV=development
PORT=3001
APP_NAME=HappyTrip

# PostgreSQL Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=happytrip
DATABASE_PASSWORD=happytrip_password
DATABASE_NAME=happytrip_db

# MongoDB
MONGODB_URI=mongodb://happytrip:happytrip_password@localhost:27017/happytrip_db?authSource=admin

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_REFRESH_EXPIRATION=7d

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=noreply@happytrip.com
MAIL_FROM_NAME=HappyTrip

# Supported Currencies (comma-separated)
SUPPORTED_CURRENCIES=EUR,GBP,USD,CHF,SEK,NOK,DKK,CZK,PLN,HUF,RON

# Supported Languages (comma-separated)
SUPPORTED_LANGUAGES=en,de,fr,es,it,pt,nl,pl,cs,hu,ro,sv,no,da

# API Documentation
SWAGGER_ENABLED=true
SWAGGER_PATH=api
```

## Installation & Running

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 13+
- MongoDB 5+
- Docker (optional)

### Step 1: Start Databases
```bash
# Using Docker Compose
docker-compose up -d

# This will start:
# - PostgreSQL on port 5432
# - MongoDB on port 27017
```

### Step 2: Install Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Step 4: Run Migrations (if any)
```bash
npm run migration:run
```

### Step 5: Start Development Server
```bash
npm run start:dev
```

The backend will be available at `http://localhost:3001`

### API Documentation
Swagger documentation is available at: `http://localhost:3001/api`

## Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Get User Profile
```bash
curl -X GET http://localhost:3001/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Next Steps

- **Phase 2**: Set up Next.js frontend with Airbnb-style UI
- **Phase 3**: Implement email notifications
- **Phase 4**: Add multi-currency and multi-language support
- **Phase 5**: Implement payment integration
- **Phase 6**: Deploy to production

## Troubleshooting

### Database Connection Issues
1. Verify Docker containers are running: `docker ps`
2. Check PostgreSQL logs: `docker logs happytrip_postgres`
3. Check MongoDB logs: `docker logs happytrip_mongodb`

### Port Already in Use
```bash
# Kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Kill process using port 5432
lsof -ti:5432 | xargs kill -9

# Kill process using port 27017
lsof -ti:27017 | xargs kill -9
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## File Structure

```
backend/
├── src/
│   ├── auth/
│   │   ├── strategies/
│   │   ├── dto/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── auth.controller.ts
│   ├── users/
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── users.controller.ts
│   ├── flights/
│   │   ├── schemas/
│   │   ├── dto/
│   │   ├── flights.module.ts
│   │   ├── flights.service.ts
│   │   └── flights.controller.ts
│   ├── accommodations/
│   │   ├── schemas/
│   │   ├── dto/
│   │   ├── accommodations.module.ts
│   │   ├── accommodations.service.ts
│   │   └── accommodations.controller.ts
│   ├── bookings/
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── bookings.module.ts
│   │   ├── bookings.service.ts
│   │   └── bookings.controller.ts
│   ├── common/
│   │   └── dto/
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .eslintrc.js
├── .prettierrc
└── .env.example
```

## References

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Mongoose Documentation](https://mongoosejs.com)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Status**: ✅ Phase 1 Complete
**Next Phase**: Phase 2 - Frontend Setup with Next.js
