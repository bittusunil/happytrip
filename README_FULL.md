# HappyTrip - Travel Booking Platform

A comprehensive travel booking application similar to Expedia with Airbnb-style UI, built with modern web technologies.

## 🌟 Features

### Core Features
- **Flight Search & Booking**: Search and book flights across Europe
- **Accommodation Search & Booking**: Find and book hotels, apartments, villas, and more
- **User Authentication**: Secure email/password authentication with JWT
- **User Profiles**: Manage personal information and preferences
- **Booking Management**: View, manage, and cancel bookings
- **Advanced Search**: Filter by price, airline, stops, property type, rating, etc.
- **Sorting Options**: Sort results by price, duration, rating, etc.
- **Pagination**: Efficient pagination for search results

### Regional Features
- **Multi-Currency Support**: 11 EMEA currencies (EUR, GBP, USD, CHF, SEK, NOK, DKK, CZK, PLN, HUF, RON)
- **Multi-Language Support**: 14 European languages (EN, DE, FR, ES, IT, PT, NL, PL, CS, HU, RO, SV, NO, DA)
- **Email Notifications**: Booking confirmations and updates
- **Responsive Design**: Mobile, tablet, and desktop optimized

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios with interceptors
- **UI Components**: Custom reusable components

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Databases**:
  - **PostgreSQL**: User management, bookings, transactions
  - **MongoDB**: Flights, accommodations, reviews
- **Authentication**: JWT with refresh tokens
- **ORM**: TypeORM (PostgreSQL), Mongoose (MongoDB)
- **Email**: Nodemailer
- **Validation**: Class Validator & Class Transformer

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git
- **API Documentation**: Swagger/OpenAPI

## 📊 Database Schema

### PostgreSQL (Users & Bookings)

**Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(20),
  country VARCHAR(100),
  language VARCHAR(10) DEFAULT 'en',
  currency VARCHAR(3) DEFAULT 'EUR',
  emailVerified BOOLEAN DEFAULT FALSE,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Bookings Table**
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL REFERENCES users(id),
  type VARCHAR(20) NOT NULL, -- 'flight' or 'accommodation'
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  referenceId VARCHAR(100) NOT NULL,
  totalPrice DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  bookingDetails JSONB,
  checkInDate TIMESTAMP,
  checkOutDate TIMESTAMP,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB (Flights & Accommodations)

**Flights Collection**
```javascript
{
  _id: ObjectId,
  flightNumber: String,
  airline: String,
  aircraft: String,
  departure: {
    code: String,
    city: String,
    country: String,
    time: Date
  },
  arrival: {
    code: String,
    city: String,
    country: String,
    time: Date
  },
  duration: Number, // in minutes
  stops: Number,
  pricing: {
    economy: Number,
    business: Number,
    firstClass: Number
  },
  currency: String,
  availableSeats: {
    economy: Number,
    business: Number,
    firstClass: Number
  },
  amenities: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Accommodations Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  type: String, // hotel, apartment, villa, etc.
  description: String,
  location: {
    city: String,
    country: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [String],
  rooms: {
    total: Number,
    available: Number,
    types: [String]
  },
  amenities: [String],
  pricing: {
    basePrice: Number,
    currency: String
  },
  rating: {
    average: Number,
    count: Number
  },
  reviews: [ObjectId], // References to reviews
  createdAt: Date,
  updatedAt: Date
}
```

**Reviews Collection**
```javascript
{
  _id: ObjectId,
  accommodationId: ObjectId,
  userId: ObjectId,
  rating: Number,
  title: String,
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Users
- `GET /users/profile` - Get current user profile
- `PUT /users/:id` - Update user profile
- `PUT /users/:id/preferences` - Update language/currency

### Flights
- `GET /flights/search` - Search flights
- `GET /flights/:id` - Get flight details
- `GET /flights/airline/:airline` - Get flights by airline

### Accommodations
- `GET /accommodations/search` - Search accommodations
- `GET /accommodations/:id` - Get accommodation details
- `GET /accommodations/:id/reviews` - Get accommodation reviews
- `POST /accommodations/:id/reviews` - Add review

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id` - Update booking
- `PUT /bookings/:id/status` - Update booking status
- `DELETE /bookings/:id` - Cancel booking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- MongoDB 5+
- Docker (optional)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/happytrip.git
   cd happytrip
   ```

2. **Start databases**
   ```bash
   docker-compose up -d
   ```

3. **Setup backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run start:dev
   ```

4. **Setup frontend** (in another terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - API Docs: http://localhost:3001/api

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

## 📁 Project Structure

```
happytrip/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication
│   │   ├── users/             # User management
│   │   ├── flights/           # Flight management
│   │   ├── accommodations/    # Accommodation management
│   │   ├── bookings/          # Booking management
│   │   ├── common/            # Shared utilities
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/               # Pages
│   │   ├── components/        # React components
│   │   ├── services/          # API service
│   │   ├── store/             # Zustand stores
│   │   ├── types/             # TypeScript types
│   │   ├── styles/            # Global styles
│   │   ├── hooks/             # Custom hooks
│   │   └── utils/             # Utilities
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── docs/                       # Documentation
│   ├── PHASE1_SETUP.md
│   ├── PHASE2_FRONTEND_SETUP.md
│   ├── PHASE3_AUTHENTICATION.md
│   ├── PHASE4_FLIGHTS.md
│   ├── PHASE5_ACCOMMODATIONS.md
│   ├── PHASE6_BOOKINGS.md
│   └── PHASE7_INTERNATIONALIZATION.md
├── docker-compose.yml
├── .gitignore
├── QUICK_START.md
└── README.md
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **CORS Protection**: Configured CORS headers
- **Input Validation**: Class validator for all inputs
- **Rate Limiting**: API rate limiting
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

## 🌍 Internationalization

### Supported Currencies
EUR, GBP, USD, CHF, SEK, NOK, DKK, CZK, PLN, HUF, RON

### Supported Languages
English, Deutsch, Français, Español, Italiano, Português, Nederlands, Polski, Čeština, Magyar, Română, Svenska, Norsk, Dansk

### Implementation
- Currency conversion at checkout
- Language preference stored in user profile
- Dynamic content translation
- Locale-specific formatting (dates, numbers)

## 📊 Performance Optimization

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **CSS Optimization**: Tailwind CSS purging
- **API Caching**: Implemented in axios interceptor
- **Database Indexing**: Indexed frequently queried fields
- **Pagination**: Efficient data pagination
- **Lazy Loading**: Components and routes

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:cov        # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                 # Run all tests
npm run test:watch      # Watch mode
```

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get up and running quickly
- **[Phase 1: Project Setup](./docs/PHASE1_SETUP.md)** - Backend initialization
- **[Phase 2: Frontend Setup](./docs/PHASE2_FRONTEND_SETUP.md)** - Frontend architecture
- **[Phase 3: Authentication](./docs/PHASE3_AUTHENTICATION.md)** - Auth system
- **[Phase 4: Flights](./docs/PHASE4_FLIGHTS.md)** - Flight search & booking
- **[Phase 5: Accommodations](./docs/PHASE5_ACCOMMODATIONS.md)** - Accommodation search
- **[Phase 6: Bookings](./docs/PHASE6_BOOKINGS.md)** - Booking flow
- **[Phase 7: Internationalization](./docs/PHASE7_INTERNATIONALIZATION.md)** - Multi-language/currency

## 🐛 Known Issues & Limitations

- Payment integration is not yet implemented
- Email notifications require SMTP configuration
- Social login (Google, Facebook) is not yet implemented
- Advanced analytics not included

## 🗺️ Roadmap

### Phase 8: Deployment & Documentation
- Deployment guides for various platforms
- CI/CD pipeline setup
- Production checklist

### Phase 9: Final Delivery
- Repository cleanup
- Final documentation
- Release notes

### Future Enhancements
- Payment gateway integration (Stripe)
- Advanced analytics
- Social login
- Mobile app (React Native)
- Real-time notifications
- Wishlist/favorites feature
- User reviews and ratings
- Recommendation engine

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Inspired by Expedia and Airbnb
- Built with modern web technologies
- Community contributions and feedback

## 📞 Support

For support, email support@happytrip.com or open an issue on GitHub.

---

**Made with ❤️ by the HappyTrip Team**

[Quick Start](./QUICK_START.md) | [Documentation](./docs/) | [Issues](https://github.com/yourusername/happytrip/issues)
