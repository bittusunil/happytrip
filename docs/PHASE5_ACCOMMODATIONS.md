# Phase 5: Accommodation Search & Listing Features

## Overview

This phase implements comprehensive accommodation search and listing functionality with advanced filtering, sorting, and pagination. The implementation follows Airbnb-style UI patterns with image galleries and amenity displays.

## What Was Done

### 1. Accommodation Search Form Component

**File**: `frontend/src/components/AccommodationSearchForm.tsx`

**Features:**
- City/location input
- Check-in date picker
- Check-out date picker
- Guest count selector (1-8 guests)
- Form validation with error messages
- Loading state during search

**Form Validation:**
```typescript
- City: Required
- Check-in Date: Required
- Check-out Date: Required
- Check-out Date must be after check-in date
- Guests: 1-8
```

**Props:**
```typescript
interface AccommodationSearchFormProps {
  onSearch: (data: any) => void;
  isLoading?: boolean;
}
```

**Usage:**
```tsx
<AccommodationSearchForm 
  onSearch={handleSearch} 
  isLoading={isLoading} 
/>
```

### 2. Accommodation Card Component

**File**: `frontend/src/components/AccommodationCard.tsx`

**Displays:**
- Property image (with fallback emoji)
- Property name
- Location (city, country)
- Star rating and review count
- Property type and room count
- Description (truncated)
- Amenities with icons
- Base price per night
- View Details and Select buttons

**Features:**
- Image error handling with fallback
- Amenity icons (WiFi, Coffee, Pool)
- Responsive grid layout
- Hover effects
- Type-specific emojis

**Props:**
```typescript
interface AccommodationCardProps {
  accommodation: Accommodation;
  onSelect?: (accommodation: Accommodation) => void;
}
```

**Accommodation Data Structure:**
```typescript
interface Accommodation {
  _id: string;
  name: string;
  type: string; // hotel, apartment, villa, cottage, resort, hostel
  description: string;
  location: {
    city: string;
    country: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  images: string[];
  rooms: {
    total: number;
    available: number;
    types: string[];
  };
  amenities: string[];
  pricing: {
    basePrice: number;
    currency: string;
  };
  rating: {
    average: number;
    count: number;
  };
  reviews?: string[];
}
```

### 3. Accommodations Search Page

**File**: `frontend/src/app/accommodations/page.tsx`

**Features:**
- Accommodation search form integration
- Advanced filtering sidebar
- Sorting options
- Pagination
- Responsive layout
- Empty states
- Loading states
- Recent search tracking

**Search Parameters:**
- City name
- Check-in date
- Check-out date
- Number of guests

**Filters:**
1. **Property Type**
   - Hotel
   - Apartment
   - Villa
   - Cottage
   - Resort
   - Hostel
   - All Types

2. **Price Range**
   - Minimum price slider (0-10,000 EUR)
   - Maximum price slider (0-10,000 EUR)
   - Real-time filtering

3. **Minimum Rating**
   - All Ratings
   - 3+ Stars
   - 3.5+ Stars
   - 4+ Stars
   - 4.5+ Stars

**Sorting Options:**
- Sort by Price (ascending)
- Sort by Rating (descending)

**Pagination:**
- 10 results per page
- Previous/Next buttons
- Current page indicator
- Total pages display

**Responsive Design:**
- Mobile: Filters in collapsible sidebar
- Tablet: Sidebar visible
- Desktop: Full layout

### 4. State Management Integration

**Search Store Usage:**
```typescript
const { 
  accommodationSearchParams, 
  setAccommodationSearchParams, 
  addRecentSearch 
} = useSearchStore();
```

**State Persistence:**
- Search parameters saved in Zustand store
- Recent searches tracked with timestamps
- Local storage persistence

### 5. API Integration

**API Endpoints Used:**
```typescript
// Search accommodations
await apiService.searchAccommodations({
  city: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  page: number;
  limit: number;
})

// Get accommodation details
await apiService.getAccommodationById(id: string)

// Get accommodations by city
await apiService.getAccommodationsByCity(city: string)

// Get accommodations by type
await apiService.getAccommodationsByType(type: string)

// Get accommodation reviews
await apiService.getAccommodationReviews(id: string)

// Add accommodation review
await apiService.addAccommodationReview(id: string, reviewData)
```

**Response Format:**
```typescript
interface PaginatedResponse<Accommodation> {
  data: Accommodation[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
```

### 6. URL Query Parameters

The accommodations page supports URL query parameters for bookmarkable searches:

```
/accommodations?city=Paris&checkInDate=2024-02-01&checkOutDate=2024-02-05&guests=2
```

**Supported Parameters:**
- `city`: City name
- `checkInDate`: Check-in date (YYYY-MM-DD)
- `checkOutDate`: Check-out date (YYYY-MM-DD)
- `guests`: Number of guests

### 7. Error Handling

**Error Cases:**
- No accommodations found
- API errors
- Network errors
- Invalid search parameters
- Image loading errors

**Error Display:**
- Toast notifications for API errors
- Empty state card for no results
- Form validation errors
- Image fallback with emoji

### 8. Performance Optimizations

- **Lazy Loading**: Components load on demand
- **Image Optimization**: Fallback emojis for missing images
- **Pagination**: Only 10 results per page
- **Filtering**: Client-side filtering for better UX
- **Sorting**: Client-side sorting
- **Memoization**: Components optimized with React.memo

## File Structure

```
frontend/
├── src/
│   ├── app/
│   │   └── accommodations/
│   │       └── page.tsx                    # Accommodations search page
│   ├── components/
│   │   ├── AccommodationSearchForm.tsx    # Search form component
│   │   └── AccommodationCard.tsx          # Accommodation card component
│   ├── services/
│   │   └── api.ts                         # API service (updated)
│   ├── store/
│   │   └── searchStore.ts                 # Search store (updated)
│   └── types/
│       └── index.ts                       # Types (updated)
```

## Component Usage Examples

### Using AccommodationSearchForm

```tsx
import AccommodationSearchForm from '@/components/AccommodationSearchForm';

function MyComponent() {
  const handleSearch = (data) => {
    console.log('Search data:', data);
    // Navigate to results or update state
  };

  return (
    <AccommodationSearchForm 
      onSearch={handleSearch}
      isLoading={false}
    />
  );
}
```

### Using AccommodationCard

```tsx
import AccommodationCard from '@/components/AccommodationCard';

function AccommodationsList() {
  const accommodations = [/* accommodation data */];

  return (
    <div>
      {accommodations.map(accommodation => (
        <AccommodationCard 
          key={accommodation._id} 
          accommodation={accommodation}
          onSelect={(acc) => console.log('Selected:', acc)}
        />
      ))}
    </div>
  );
}
```

### Using Accommodations Page

```tsx
// Automatically handles:
// - URL query parameters
// - Search form submission
// - Filtering and sorting
// - Pagination
// - Error handling
// - Loading states
```

## Search Flow

```
User enters search criteria
        ↓
Form validation
        ↓
API request with filters
        ↓
Response received
        ↓
Client-side filtering applied
        ↓
Results displayed with pagination
        ↓
User can filter, sort, or paginate
        ↓
Recent search saved
```

## Filtering Flow

```
Initial results loaded
        ↓
User selects property type
        ↓
Results filtered on client
        ↓
Updated results displayed
        ↓
User adjusts price range
        ↓
Results filtered further
        ↓
User selects minimum rating
        ↓
Final filtered results shown
```

## Sorting Implementation

```typescript
// Sort by price
const sorted = [...accommodations].sort((a, b) => 
  a.pricing.basePrice - b.pricing.basePrice
);

// Sort by rating
const sorted = [...accommodations].sort((a, b) => 
  b.rating.average - a.rating.average
);
```

## Pagination Implementation

```typescript
// Fetch page 1
const response = await apiService.searchAccommodations({
  ...params,
  page: 1,
  limit: 10
});

// Navigate to page 2
setPage(2);

// Fetch page 2
const response = await apiService.searchAccommodations({
  ...params,
  page: 2,
  limit: 10
});
```

## Property Types

| Type | Emoji | Description |
|------|-------|-------------|
| Hotel | 🏨 | Traditional hotel accommodation |
| Apartment | 🏠 | Self-catering apartment |
| Villa | 🏡 | Luxury villa with amenities |
| Cottage | 🏘️ | Cozy cottage accommodation |
| Resort | 🏖️ | All-inclusive resort |
| Hostel | 🛏️ | Budget hostel accommodation |

## Amenities

Common amenities displayed:
- WiFi
- Coffee maker
- Swimming pool
- Gym
- Restaurant
- Bar
- Parking
- Air conditioning
- Heating
- Washer/Dryer
- Kitchen
- Balcony
- Garden
- Pets allowed

## Responsive Design Breakpoints

```css
/* Mobile: < 640px */
- Single column layout
- Collapsible filters
- Full-width cards
- Image on top

/* Tablet: 640px - 1024px */
- Two column layout
- Visible filters
- Responsive cards
- Image on left

/* Desktop: > 1024px */
- Three column layout (filters + results)
- Sticky filters
- Large cards
- Image on left
```

## Accessibility Features

- Semantic HTML elements
- ARIA labels for form inputs
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly
- Image alt text

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Testing Scenarios

### Manual Testing

1. **Basic Search**
   - [ ] Enter city name
   - [ ] Select check-in date
   - [ ] Select check-out date
   - [ ] Select guests
   - [ ] Click search
   - [ ] Results display

2. **Filtering**
   - [ ] Select property type
   - [ ] Adjust price range
   - [ ] Select minimum rating
   - [ ] Results update correctly

3. **Sorting**
   - [ ] Sort by price
   - [ ] Sort by rating
   - [ ] Results reorder correctly

4. **Pagination**
   - [ ] Navigate to next page
   - [ ] Navigate to previous page
   - [ ] Page indicator updates

5. **Error Handling**
   - [ ] Invalid search shows error
   - [ ] Network error shows message
   - [ ] Empty results show helpful message
   - [ ] Image errors show fallback emoji

6. **Responsive Design**
   - [ ] Mobile layout works
   - [ ] Tablet layout works
   - [ ] Desktop layout works
   - [ ] Filters toggle on mobile

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Performance Metrics

- **First Contentful Paint (FCP)**: < 2s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

## Known Issues & Limitations

- Image loading may be slow on slow connections
- Real-time availability not implemented
- Advanced filters (amenities, etc.) limited
- Reviews not displayed on listing page

## Future Enhancements

- [ ] Map view
- [ ] Amenity filters
- [ ] Review display on listing
- [ ] Photo gallery
- [ ] Virtual tours
- [ ] Saved properties
- [ ] Price calendar
- [ ] Availability calendar
- [ ] Host information
- [ ] Guest reviews

## Troubleshooting

### No accommodations showing
1. Check API URL in `.env.local`
2. Verify backend is running
3. Check browser console for errors
4. Try different search criteria

### Filters not working
1. Refresh the page
2. Clear browser cache
3. Check if accommodations data is loaded
4. Verify filter values are correct

### Pagination not working
1. Check if results exceed 10
2. Verify page state is updating
3. Check API response format

### Images not loading
1. Check image URLs in API response
2. Verify CORS settings on image server
3. Check browser console for errors
4. Fallback emoji should display

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Axios](https://axios-http.com)

---

**Status**: ✅ Phase 5 Complete
**Next Phase**: Phase 6 - Booking Functionality & Payment Integration
