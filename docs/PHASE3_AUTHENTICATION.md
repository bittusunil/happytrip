# Phase 3: Authentication System & User Pages

## Overview

This phase implements the complete authentication system with login, registration, and user management pages. All pages include form validation, error handling, and integration with the backend API.

## What Was Done

### 1. Authentication Pages

#### Login Page (`/login`)
**Features:**
- Email and password input fields
- Form validation with error messages
- "Remember me" checkbox
- "Forgot password" link
- Social login placeholders (Google, Facebook)
- Link to registration page
- Loading states and error handling
- Automatic redirect to home if already authenticated

**Form Validation:**
- Email: Required, valid email format
- Password: Required, minimum 8 characters

**API Integration:**
- Calls `apiService.login()` on form submission
- Stores JWT tokens in localStorage
- Updates auth store with user data
- Redirects to home page on success

#### Register Page (`/register`)
**Features:**
- First name and last name inputs
- Email input with validation
- Password with strength requirements
- Password confirmation with matching validation
- Terms of Service agreement checkbox
- Form validation with detailed error messages
- Social signup placeholders
- Link to login page
- Loading states and error handling

**Form Validation:**
- First Name: Required, minimum 2 characters
- Last Name: Required, minimum 2 characters
- Email: Required, valid email format
- Password: Required, minimum 8 characters, must contain uppercase, lowercase, and number
- Confirm Password: Must match password field
- Terms Agreement: Must be checked

**API Integration:**
- Calls `apiService.register()` on form submission
- Stores JWT tokens in localStorage
- Updates auth store with user data
- Redirects to home page on success

#### Profile Page (`/profile`)
**Features:**
- View personal information
- Edit profile functionality
- Update first name, last name, phone number, country
- Currency preference selection
- Language preference selection
- Account information display (member since, email verified)
- Email field is disabled (cannot be changed)
- Loading states and error handling
- Toast notifications for success/error

**Sections:**
1. **Personal Information**
   - First Name (editable)
   - Last Name (editable)
   - Email (read-only)
   - Phone Number (editable)
   - Country (editable)

2. **Preferences**
   - Currency selector (11 EMEA currencies)
   - Language selector (14 European languages)

3. **Account Information**
   - Member since date
   - Email verification status

**API Integration:**
- Fetches user profile from API
- Updates profile using `apiService.updateProfile()`
- Updates preferences using `apiService.updatePreferences()`
- Syncs with auth store and search store

#### Bookings Page (`/bookings`)
**Features:**
- Display all user bookings
- Filter bookings by status (All, Pending, Confirmed, Cancelled, Completed)
- Pagination support
- View booking details
- Cancel booking functionality
- Status badges with color coding
- Empty state with CTA buttons
- Loading states

**Booking Information Displayed:**
- Booking type (Flight/Accommodation)
- Reference ID
- Status badge
- Check-in/Check-out dates
- Total price and currency
- Booking details (JSON)
- Notes
- Booking date

**Status Colors:**
- Pending: Yellow
- Confirmed: Green
- Cancelled: Red
- Completed: Blue

**API Integration:**
- Fetches bookings using `apiService.getBookings()`
- Cancels booking using `apiService.cancelBooking()`
- Supports pagination
- Filters on client-side

### 2. Form Validation

#### React Hook Form Integration
- `useForm` hook for form state management
- `register` function for field registration
- `handleSubmit` for form submission
- `watch` for dependent field validation
- `formState` for error tracking

#### Validation Rules
- **Email**: Required, valid format
- **Password**: Required, minimum length, pattern matching
- **Confirm Password**: Match validation
- **Names**: Required, minimum length
- **Terms**: Checkbox validation

#### Error Display
- Field-level error messages
- Helper text for guidance
- Real-time validation on blur
- Clear error states

### 3. State Management Integration

#### Auth Store Usage
```typescript
const { user, isAuthenticated, login, register, logout, setUser } = useAuthStore();
```

#### Search Store Usage
```typescript
const { currency, language, setCurrency, setLanguage } = useSearchStore();
```

#### Protected Routes
- Check `isAuthenticated` on component mount
- Redirect to login if not authenticated
- Load user from storage on app start

### 4. API Service Integration

#### Auth Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

#### User Endpoints
- `GET /users/profile` - Get current user profile
- `PUT /users/:id` - Update user profile
- `PUT /users/:id/preferences` - Update language/currency

#### Booking Endpoints
- `GET /bookings` - Get user bookings with pagination
- `PUT /bookings/:id/cancel` - Cancel a booking

### 5. UI/UX Features

#### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly buttons and inputs
- Responsive grids and layouts

#### Accessibility
- Proper label associations
- ARIA attributes
- Keyboard navigation
- Focus management
- Color contrast compliance

#### User Feedback
- Toast notifications for success/error
- Loading states on buttons
- Form validation messages
- Empty states with helpful CTAs
- Disabled states for invalid actions

### 6. Security Features

#### Token Management
- JWT tokens stored in localStorage
- Automatic token refresh on 401
- Logout clears all tokens
- Secure password hashing (bcrypt)

#### Form Security
- Password confirmation validation
- Terms agreement requirement
- Email format validation
- CSRF protection (via API)

#### Protected Routes
- Check authentication on mount
- Redirect unauthenticated users
- Prevent unauthorized access

## File Structure

```
frontend/src/app/
├── login/
│   └── page.tsx              # Login page
├── register/
│   └── page.tsx              # Registration page
├── profile/
│   └── page.tsx              # User profile page
└── bookings/
    └── page.tsx              # Bookings list page
```

## Usage Examples

### Login Flow
```tsx
// User navigates to /login
// Enters email and password
// Clicks "Sign In"
// API validates credentials
// Tokens stored in localStorage
// Auth store updated
// Redirected to home page
```

### Registration Flow
```tsx
// User navigates to /register
// Fills in all required fields
// Validates password strength
// Confirms password match
// Agrees to terms
// Clicks "Create Account"
// API creates user account
// Tokens stored in localStorage
// Auth store updated
// Redirected to home page
```

### Profile Update Flow
```tsx
// User navigates to /profile
// Clicks "Edit" button
// Updates form fields
// Clicks "Save Changes"
// API updates profile
// Auth store updated
// Toast notification shown
// Form switches to view mode
```

### Booking Management Flow
```tsx
// User navigates to /bookings
// Views all bookings with status
// Filters by status
// Clicks "Cancel" on pending booking
// Confirmation dialog appears
// API cancels booking
// Booking list refreshed
// Toast notification shown
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPPORTED_CURRENCIES=EUR,GBP,USD,CHF,SEK,NOK,DKK,CZK,PLN,HUF,RON
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,de,fr,es,it,pt,nl,pl,cs,hu,ro,sv,no,da
```

## Testing

### Manual Testing Checklist

#### Login Page
- [ ] Empty form shows validation errors on submit
- [ ] Invalid email format shows error
- [ ] Password less than 8 characters shows error
- [ ] Valid credentials login successfully
- [ ] Invalid credentials show error message
- [ ] Already authenticated users redirected to home
- [ ] Loading state shows during submission
- [ ] "Forgot password" link works
- [ ] "Sign up" link works

#### Register Page
- [ ] All fields required validation works
- [ ] Email format validation works
- [ ] Password strength validation works
- [ ] Password confirmation validation works
- [ ] Terms checkbox required
- [ ] Valid registration creates account
- [ ] Duplicate email shows error
- [ ] Loading state shows during submission
- [ ] "Sign in" link works

#### Profile Page
- [ ] Unauthenticated users redirected to login
- [ ] User data loads correctly
- [ ] Edit button toggles edit mode
- [ ] Profile updates save correctly
- [ ] Currency change persists
- [ ] Language change persists
- [ ] Account info displays correctly
- [ ] Email field is read-only

#### Bookings Page
- [ ] Unauthenticated users redirected to login
- [ ] Bookings load correctly
- [ ] Status filters work
- [ ] Pagination works
- [ ] Cancel booking shows confirmation
- [ ] Booking cancellation updates list
- [ ] Empty state shows when no bookings
- [ ] CTA buttons work in empty state

## API Response Examples

### Login Response
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "language": "en",
    "currency": "EUR",
    "isActive": true
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Profile Response
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

### Bookings Response
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "type": "flight",
      "status": "confirmed",
      "referenceId": "FL123456",
      "totalPrice": 250.00,
      "currency": "EUR",
      "bookingDetails": {},
      "checkInDate": "2024-02-01T00:00:00Z",
      "checkOutDate": "2024-02-05T00:00:00Z",
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

## Error Handling

### Common Errors

#### 400 Bad Request
- Invalid form data
- Missing required fields
- Email already exists

#### 401 Unauthorized
- Invalid credentials
- Expired token
- Missing token

#### 404 Not Found
- User not found
- Booking not found

#### 500 Internal Server Error
- Database error
- Server error

### Error Display
- Toast notifications for API errors
- Form field errors for validation
- Generic error message fallback
- Detailed error logging in console

## Next Steps

- **Phase 4**: Build flight search and listing pages
- **Phase 5**: Build accommodation search and listing pages
- **Phase 6**: Implement booking flow
- **Phase 7**: Add email notifications and multi-language support

## Troubleshooting

### Login Not Working
1. Verify backend is running
2. Check API URL in `.env.local`
3. Check browser console for errors
4. Verify credentials are correct

### Form Validation Not Working
1. Check react-hook-form version
2. Verify validation rules are correct
3. Check form field registration

### Tokens Not Persisting
1. Check localStorage is enabled
2. Verify browser privacy settings
3. Check API response includes tokens

## References

- [React Hook Form Documentation](https://react-hook-form.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com)
- [Next.js Navigation](https://nextjs.org/docs/app/api-reference/functions/use-router)

---

**Status**: ✅ Phase 3 Complete
**Next Phase**: Phase 4 - Flight Search & Listing Pages
