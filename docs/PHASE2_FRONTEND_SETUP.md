# Phase 2: Frontend Setup with Next.js & Airbnb-Style UI

## Overview

This phase establishes the frontend infrastructure with Next.js 14, Tailwind CSS, and Airbnb-inspired UI components. The frontend is designed for optimal user experience with responsive design and modern React patterns.

## What Was Done

### 1. Next.js Project Setup

#### Framework & Tools
- **Next.js 14**: Latest version with App Router
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **React Hot Toast**: Notification system

#### Configuration Files
- `next.config.js`: Next.js configuration with image optimization
- `tailwind.config.js`: Custom theme with primary and secondary colors
- `tsconfig.json`: TypeScript configuration with path aliases
- `.eslintrc.json`: ESLint configuration
- `.prettierrc`: Code formatting rules

### 2. Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── Button.tsx          # Reusable button component
│   │   ├── Input.tsx           # Reusable input component
│   │   ├── Card.tsx            # Reusable card component
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Footer section
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   └── index.ts            # Component exports
│   ├── services/
│   │   └── api.ts              # API service with interceptors
│   ├── store/
│   │   ├── authStore.ts        # Auth state management
│   │   └── searchStore.ts      # Search state management
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── styles/
│   │   └── globals.css         # Global styles
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   ├── pages/                  # Page components
│   └── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── .eslintrc.json
├── .prettierrc
└── .env.example
```

### 3. Core Components

#### Button Component
- **Variants**: primary, secondary, outline, ghost
- **Sizes**: sm, md, lg
- **Features**: Loading state, full width, disabled state
- **Accessibility**: Focus states, proper ARIA attributes

```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

#### Input Component
- **Features**: Label, error message, helper text, icon support
- **Validation**: Error state styling
- **Accessibility**: Proper label association

```tsx
<Input
  label="Email"
  type="email"
  error={errors.email?.message}
  placeholder="Enter your email"
/>
```

#### Card Component
- **Features**: Hoverable state, customizable padding
- **Styling**: Shadow effects, border styling
- **Responsive**: Works on all screen sizes

```tsx
<Card hoverable padding="md">
  Card content
</Card>
```

#### Header Component
- **Features**: Logo, navigation menu, user dropdown
- **Responsive**: Mobile hamburger menu
- **Auth-aware**: Shows different UI for authenticated users
- **Links**: Flights, Accommodations, About

#### Footer Component
- **Sections**: Company info, Quick links, Support, Contact
- **Features**: Social media links, contact information
- **Responsive**: Grid layout adapts to screen size

### 4. State Management (Zustand)

#### Auth Store
```typescript
// Features:
- User authentication state
- Login/Register actions
- Token management
- User persistence
- Error handling
```

#### Search Store
```typescript
// Features:
- Flight search parameters
- Accommodation search parameters
- User preferences (currency, language)
- Recent searches
- Local storage persistence
```

### 5. API Service

#### Features
- **Axios Instance**: Configured with base URL
- **Request Interceptor**: Automatically adds JWT token
- **Response Interceptor**: Handles 401 errors and token refresh
- **Token Management**: Automatic token refresh
- **Error Handling**: Centralized error handling

#### Methods
```typescript
// Auth
register(email, password, firstName, lastName)
login(email, password)
refreshAccessToken()
logout()
isAuthenticated()

// Users
getProfile()
updateProfile(data)
updatePreferences(language, currency)

// Flights
searchFlights(params)
getFlightById(id)
getFlightsByAirline(airline)

// Accommodations
searchAccommodations(params)
getAccommodationById(id)
getAccommodationsByCity(city)
getAccommodationsByType(type)
getAccommodationReviews(id)
addAccommodationReview(id, reviewData)

// Bookings
createBooking(bookingData)
getBookings(page, limit)
getBookingById(id)
getBookingByReference(referenceId)
updateBooking(id, data)
updateBookingStatus(id, status)
cancelBooking(id)
```

### 6. TypeScript Types

Comprehensive types for all entities:
- **User**: User profile and authentication
- **Flight**: Flight details, pricing, availability
- **Accommodation**: Hotel/apartment details, amenities, reviews
- **Booking**: Booking information, status, details
- **Search**: Search parameters and filters
- **API**: Response and pagination types

### 7. Styling

#### Tailwind Configuration
- **Custom Colors**: Primary (sky blue) and secondary (purple)
- **Custom Shadows**: Card shadows with hover effects
- **Animations**: Fade-in and slide-up animations
- **Responsive Grid**: Automatic grid layout adaptation

#### Global Styles
- **CSS Variables**: For consistent theming
- **Utility Classes**: `.btn`, `.card`, `.input`, etc.
- **Scrollbar Styling**: Custom scrollbar appearance
- **Loading Animation**: Shimmer effect for skeletons

### 8. Home Page

Features:
- **Hero Section**: Attractive banner with CTA buttons
- **Features Section**: 4 key features with icons
- **CTA Section**: Call-to-action for new users
- **Popular Destinations**: Grid of destination cards
- **Responsive Design**: Works on mobile, tablet, desktop

### 9. Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=HappyTrip
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_SUPPORTED_CURRENCIES=EUR,GBP,USD,CHF,SEK,NOK,DKK,CZK,PLN,HUF,RON
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,de,fr,es,it,pt,nl,pl,cs,hu,ro,sv,no,da
NEXT_PUBLIC_DEFAULT_CURRENCY=EUR
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

## Installation & Running

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running on port 3001

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Step 3: Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Step 4: Build for Production
```bash
npm run build
npm start
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run type-check

# Format code
npm run format
```

## Component Usage Examples

### Button
```tsx
import { Button } from '@/components';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="outline" fullWidth isLoading={isLoading}>
  Loading...
</Button>
```

### Input
```tsx
import { Input } from '@/components';

<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
  helperText="We'll never share your email"
/>
```

### Card
```tsx
import { Card } from '@/components';

<Card hoverable padding="lg">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### Layout
```tsx
import { Layout } from '@/components';

<Layout>
  {/* Your page content */}
</Layout>
```

## State Management Examples

### Using Auth Store
```tsx
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login(email, password)}>Login</button>
      )}
    </div>
  );
}
```

### Using Search Store
```tsx
import { useSearchStore } from '@/store/searchStore';

function SearchComponent() {
  const { flightSearchParams, setFlightSearchParams } = useSearchStore();

  return (
    <input
      value={flightSearchParams.departure}
      onChange={(e) =>
        setFlightSearchParams({ departure: e.target.value })
      }
    />
  );
}
```

## API Service Usage

```tsx
import { apiService } from '@/services/api';

// Login
const response = await apiService.login(email, password);

// Search flights
const flights = await apiService.searchFlights({
  departure: 'BER',
  arrival: 'CDG',
  departureDate: '2024-01-15',
});

// Create booking
const booking = await apiService.createBooking({
  type: 'flight',
  referenceId: 'FL123456',
  totalPrice: 250.00,
  currency: 'EUR',
});
```

## Responsive Design

The frontend uses Tailwind CSS breakpoints:
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: > 1024px (lg)

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

## Performance Optimization

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic code splitting by Next.js
- **CSS Optimization**: Tailwind CSS purging unused styles
- **API Caching**: Implemented in API service
- **Component Memoization**: React.memo for expensive components

## Accessibility Features

- **Semantic HTML**: Proper use of semantic elements
- **ARIA Labels**: Accessible labels and descriptions
- **Keyboard Navigation**: Full keyboard support
- **Focus States**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant colors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Next Steps

- **Phase 3**: Implement authentication pages (login, register)
- **Phase 4**: Build flight search and listing pages
- **Phase 5**: Build accommodation search and listing pages
- **Phase 6**: Implement booking flow
- **Phase 7**: Add payment integration

## Troubleshooting

### Port Already in Use
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### API Connection Issues
1. Verify backend is running on port 3001
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for CORS errors

### Styling Issues
```bash
# Rebuild Tailwind CSS
npm run build
```

## File Structure Summary

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   ├── services/               # API service
│   ├── store/                  # Zustand stores
│   ├── types/                  # TypeScript types
│   ├── styles/                 # Global styles
│   ├── hooks/                  # Custom hooks (to be added)
│   ├── utils/                  # Utility functions (to be added)
│   ├── pages/                  # Page components (to be added)
│   └── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── .eslintrc.json
├── .prettierrc
└── .env.example
```

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Status**: ✅ Phase 2 Complete
**Next Phase**: Phase 3 - Authentication Pages (Login, Register)
