# HappyTrip - Quick Start Guide

Welcome to HappyTrip! This guide will help you get started with the application.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Development Workflow](#development-workflow)

## 🎯 Project Overview

HappyTrip is a comprehensive travel booking application similar to Expedia with Airbnb-style UI. It allows users to search and book flights and accommodations across Europe with multi-currency and multi-language support.

**Key Features:**
- Flight search and booking
- Accommodation search and booking
- User authentication and profiles
- Booking management
- Multi-currency support (11 EMEA currencies)
- Multi-language support (14 European languages)
- Email notifications
- Advanced filtering and sorting

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: React Icons

### Backend
- **Framework**: NestJS with TypeScript
- **Databases**:
  - PostgreSQL (users, bookings, transactions)
  - MongoDB (flights, accommodations, reviews)
- **Authentication**: JWT with refresh tokens
- **ORM**: TypeORM (PostgreSQL), Mongoose (MongoDB)
- **Email**: Nodemailer
- **Validation**: Class Validator

### DevOps
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git

## 📦 Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **npm**: 9+ or yarn 3+
- **PostgreSQL**: 13+
- **MongoDB**: 5+
- **Docker**: Optional (for containerized databases)
- **Git**: For version control

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/happytrip.git
cd happytrip
```

### Step 2: Start Databases

#### Option A: Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- MongoDB on port 27017

#### Option B: Manual Installation

**PostgreSQL:**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql
sudo systemctl start postgresql
```

**MongoDB:**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Step 3: Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run migrations (if any)
npm run migration:run
```

### Step 4: Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local
```

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

Backend will be available at: `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm run start
```

## 📁 Project Structure

```
happytrip/
├── backend/                          # NestJS Backend
│   ├── src/
│   │   ├── auth/                    # Authentication module
│   │   ├── users/                   # User management
│   │   ├── flights/                 # Flight management
│   │   ├── accommodations/          # Accommodation management
│   │   ├── bookings/                # Booking management
│   │   ├── common/                  # Shared utilities
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/                         # Next.js Frontend
│   ├── src/
│   │   ├── app/                     # Pages and layouts
│   │   ├── components/              # React components
│   │   ├── services/                # API service
│   │   ├── store/                   # Zustand stores
│   │   ├── types/                   # TypeScript types
│   │   ├── styles/                  # Global styles
│   │   ├── hooks/                   # Custom hooks
│   │   └── utils/                   # Utilities
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── .env.example
├── docs/                             # Documentation
│   ├── PHASE1_SETUP.md
│   ├── PHASE2_FRONTEND_SETUP.md
│   ├── PHASE3_AUTHENTICATION.md
│   └── ...
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 📚 Documentation

### Phase-by-Phase Documentation

1. **[Phase 1: Project Initialization & Backend Setup](./docs/PHASE1_SETUP.md)**
   - Project structure
   - Database configuration
   - Backend modules
   - API endpoints

2. **[Phase 2: Frontend Setup with Next.js](./docs/PHASE2_FRONTEND_SETUP.md)**
   - Next.js configuration
   - Component architecture
   - State management
   - API service

3. **[Phase 3: Authentication System](./docs/PHASE3_AUTHENTICATION.md)**
   - Login/Register pages
   - Profile management
   - Form validation
   - Protected routes

4. **[Phase 4: Flight Search & Listing](./docs/PHASE4_FLIGHTS.md)** *(Coming Soon)*
   - Flight search form
   - Flight cards
   - Filtering and sorting
   - Pagination

5. **[Phase 5: Accommodation Search & Listing](./docs/PHASE5_ACCOMMODATIONS.md)** *(Coming Soon)*
   - Accommodation search form
   - Accommodation cards
   - Filtering and sorting
   - Pagination

6. **[Phase 6: Booking Functionality](./docs/PHASE6_BOOKINGS.md)** *(Coming Soon)*
   - Booking flow
   - Payment integration
   - Booking management

7. **[Phase 7: Multi-Currency & Multi-Language](./docs/PHASE7_INTERNATIONALIZATION.md)** *(Coming Soon)*
   - Currency conversion
   - Language support
   - Localization

## 🔧 Development Workflow

### Adding a New Feature

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code structure
   - Write clean, documented code
   - Add tests if applicable

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

4. **Push to remote**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Describe your changes
   - Link related issues
   - Request reviews

### Code Style

- **Frontend**: Use Prettier and ESLint
  ```bash
  npm run format
  npm run lint
  ```

- **Backend**: Use Prettier and ESLint
  ```bash
  npm run format
  npm run lint
  ```

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

## 🐛 Troubleshooting

### Database Connection Issues

**PostgreSQL:**
```bash
# Check if PostgreSQL is running
psql --version

# Connect to database
psql -U happytrip -d happytrip_db
```

**MongoDB:**
```bash
# Check if MongoDB is running
mongo --version

# Connect to database
mongo mongodb://happytrip:happytrip_password@localhost:27017/happytrip_db?authSource=admin
```

### Port Already in Use

```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5432 (PostgreSQL)
lsof -ti:5432 | xargs kill -9

# Kill process on port 27017 (MongoDB)
lsof -ti:27017 | xargs kill -9
```

### Module Not Found

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3001/api

## 🌐 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=3001
APP_NAME=HappyTrip

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=happytrip
DATABASE_PASSWORD=happytrip_password
DATABASE_NAME=happytrip_db

MONGODB_URI=mongodb://happytrip:happytrip_password@localhost:27017/happytrip_db?authSource=admin

JWT_SECRET=your_secret_key
JWT_EXPIRATION=24h

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=HappyTrip
NEXT_PUBLIC_SUPPORTED_CURRENCIES=EUR,GBP,USD,CHF,SEK,NOK,DKK,CZK,PLN,HUF,RON
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,de,fr,es,it,pt,nl,pl,cs,hu,ro,sv,no,da
```

## 📱 Testing the Application

### Create a Test Account

1. Navigate to http://localhost:3000/register
2. Fill in the registration form
3. Click "Create Account"
4. You'll be redirected to the home page

### Search for Flights

1. Click "Search Flights" on the home page
2. Enter departure and arrival cities
3. Select dates and number of passengers
4. Click "Search Flights"

### Search for Accommodations

1. Click "Find Accommodations" on the home page
2. Enter city name
3. Select check-in and check-out dates
4. Select number of guests
5. Click "Search Accommodations"

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
cd frontend
npm run build
vercel deploy
```

### Backend Deployment (Heroku/Railway)

```bash
cd backend
npm run build
# Deploy using your preferred platform
```

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review error logs

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

## 🎉 Next Steps

1. **Explore the codebase**: Start with `frontend/src/app/page.tsx` and `backend/src/main.ts`
2. **Read the documentation**: Check the `docs/` folder for detailed guides
3. **Run the application**: Follow the installation and running steps above
4. **Make your first contribution**: Pick an issue or feature to work on

---

**Happy coding! 🚀**

For more information, visit the [main README](./README.md)
