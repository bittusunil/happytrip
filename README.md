# HappyTrip - Travel Application

A modern travel booking application similar to Expedia with Airbnb-style UI, built with Next.js, NestJS, PostgreSQL, and MongoDB.

## 🌟 Features

- **Flight Search & Booking**: Search and book flights with real-time availability
- **Accommodation Booking**: Browse and book hotels, apartments, and vacation rentals
- **User Authentication**: Secure email/password authentication
- **Multi-Currency Support**: EMEA region currency support with real-time conversion
- **Multi-Language Support**: Multiple language options for EMEA users
- **Email Notifications**: Booking confirmations, reminders, and updates
- **User Profiles**: Manage bookings, preferences, and payment methods
- **Search Filters**: Advanced filtering for flights and accommodations
- **Reviews & Ratings**: User reviews and ratings for accommodations

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom Airbnb-style components
- **State Management**: Redux Toolkit / Zustand
- **API Client**: Axios with interceptors

### Backend
- **Framework**: NestJS with TypeScript
- **Authentication**: JWT with refresh tokens
- **Databases**: 
  - PostgreSQL: User management, bookings, transactions
  - MongoDB: Listings, reviews, search data
- **Email Service**: Nodemailer with templates
- **Validation**: Class-validator, class-transformer

### Databases
- **PostgreSQL**: User accounts, bookings, payments, transactions
- **MongoDB**: Flight listings, accommodations, reviews, search history

## 📁 Project Structure

```
happytrip/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── flights/        # Flight management
│   │   ├── accommodations/ # Accommodation management
│   │   ├── bookings/       # Booking management
│   │   ├── common/         # Shared utilities
│   │   └── main.ts
│   ├── test/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App directory (Next.js 13+)
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   ├── styles/        # Global styles
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── docs/                   # Documentation
│   ├── SETUP.md           # Setup instructions
│   ├── API.md             # API documentation
│   ├── DATABASE.md        # Database schema
│   └── DEPLOYMENT.md      # Deployment guide
├── docker-compose.yml      # Docker compose for databases
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 13+
- MongoDB 5+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/happytrip.git
   cd happytrip
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your database credentials in .env
   npm run typeorm migration:run
   npm run start:dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api

## 📚 Documentation

- [Setup Guide](./docs/SETUP.md) - Detailed setup instructions
- [API Documentation](./docs/API.md) - Backend API endpoints
- [Database Schema](./docs/DATABASE.md) - Database design
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment

## 🔐 Environment Variables

### Backend (.env)
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=happytrip
DATABASE_PASSWORD=password
DATABASE_NAME=happytrip_db

MONGODB_URI=mongodb://localhost:27017/happytrip

JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=HappyTrip
```

## 🛠️ Development

### Backend
```bash
cd backend
npm run start:dev      # Start development server
npm run build          # Build for production
npm test               # Run tests
```

### Frontend
```bash
cd frontend
npm run dev            # Start development server
npm run build          # Build for production
npm run lint           # Run linter
```

## 📦 Docker Setup

```bash
docker-compose up -d
```

This will start PostgreSQL and MongoDB containers.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, email support@happytrip.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Phase 1: Core setup and authentication
- [ ] Phase 2: Flight and accommodation listings
- [ ] Phase 3: Booking system
- [ ] Phase 4: Payment integration
- [ ] Phase 5: Multi-currency and language support
- [ ] Phase 6: Mobile app (React Native)
- [ ] Phase 7: Advanced analytics and recommendations

---

**Made with ❤️ by HappyTrip Team**
