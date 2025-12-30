# Phase 4: Flight Search & Listing Features

## Overview

This phase implements comprehensive flight search and listing functionality with advanced filtering, sorting, and pagination capabilities. The implementation follows Airbnb-style UI patterns with responsive design.

## What Was Done

### 1. Flight Search Form Component

**File**: `frontend/src/components/FlightSearchForm.tsx`

**Features:**
- Trip type selection (Round Trip / One Way)
- Departure city input
- Arrival city input
- Departure date picker
- Return date picker (conditional on trip type)
- Passenger count selector (1-6 passengers)
- Form validation with error messages
- Loading state during search

**Form Validation:**
```typescript
- Departure: Required
- Arrival: Required
- Departure Date: Required
- Return Date: Required if round trip
- Return Date must be after departure date
- Passengers: 1-6
```

**Props:**
```typescript
interface FlightSearchFormProps {
  onSearch: (data: any) => void;
  isLoading?: boolean;
}
```

**Usage:**
```tsx
<FlightSearchForm 
  onSearch={handleSearch} 
  isLoading={isLoading} 
/>
```

### 2. Flight Card Component

**File**: `frontend/src/components/FlightCard.tsx`

**Displays:**
- Airline name and flight number
- Aircraft type
- Departure city and time
- Arrival city and time
- Flight duration with visual timeline
- Number of stops
- Available seats count
- Amenities (WiFi, meals, entertainment, etc.)
- Pricing per person
- View Details and Select buttons

**Features:**
- Time formatting (HH:MM)
- Date formatting (Mon DD)
- Duration calculation from timestamps
- Amenities display with limit and "+more" indicator
- Hover effects
- Responsive layout

**Props:**
```typescript
interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
}
```

**Flight Data Structure:**
```typescript
interface Flight {
  _id: string;
  flightNumber: string;
  airline: string;
  aircraft: string;
  departure: {
    code: string;
    city: string;
    country: string;
    time: string;
  };
  arrival: {
    code: string;
    city: string;
    country: string;
    time: string;
  };
  duration: number;
  stops: number;
  pricing: {
    economy: number;
    business?: number;
    firstClass?: number;
  };
  currency: string;
  availableSeats: {
    economy: number;
    business?: number;
    firstClass?: number;
  };
  amenities: string[];
}
```

### 3. Flights Search Page

**File**: `frontend/src/app/flights/page.tsx`

**Features:**
- Flight search form integration
- Advanced filtering sidebar
- Sorting options
- Pagination
- Responsive layout
- Empty states
- Loading states
- Recent search tracking

**Search Parameters:**
- Departure city
- Arrival city
- Departure date
- Return date (optional)
- Number of passengers

**Filters:**
1. **Price Range**
   - Slider from 0 to 10,000 EUR
   - Real-time filtering

2. **Airline Selection**
   - Dropdown with all available airlines
   - Single airline selection

3. **Stops Filter**
   - All flights
   - Non-stop only
   - 1 stop
   - 2+ stops

**Sorting Options:**
- Sort by Price (ascending)
- Sort by Duration (ascending)

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
  flightSearchParams, 
  setFlightSearchParams, 
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
// Search flights
await apiService.searchFlights({
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  page: number;
  limit: number;
})

// Get flight details
await apiService.getFlightById(id: string)

// Get flights by airline
await apiService.getFlightsByAirline(airline: string)
```

**Response Format:**
```typescript
interface PaginatedResponse<Flight> {
  data: Flight[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
```

### 6. URL Query Parameters

The flights page supports URL query parameters for bookmarkable searches:

```
/flights?departure=BER&arrival=CDG&departureDate=2024-02-01&passengers=2
```

**Supported Parameters:**
- `departure`: Departure city code
- `arrival`: Arrival city code
- `departureDate`: Departure date (YYYY-MM-DD)
- `returnDate`: Return date (YYYY-MM-DD)
- `passengers`: Number of passengers

### 7. Error Handling

**Error Cases:**
- No flights found
- API errors
- Network errors
- Invalid search parameters

**Error Display:**
- Toast notifications for API errors
- Empty state card for no results
- Form validation errors

### 8. Performance Optimizations

- **Lazy Loading**: Components load on demand
- **Pagination**: Only 10 results per page
- **Filtering**: Client-side filtering for better UX
- **Sorting**: Client-side sorting
- **Memoization**: Components optimized with React.memo

## File Structure

```
frontend/
├── src/
│   ├── app/
│   │   └── flights/
│   │       └── page.tsx              # Flights search page
│   ├── components/
│   │   ├── FlightSearchForm.tsx      # Search form component
│   │   └── FlightCard.tsx            # Flight card component
│   ├── services/
│   │   └── api.ts                    # API service (updated)
│   ├── store/
│   │   └── searchStore.ts            # Search store (updated)
│   └── types/
│       └── index.ts                  # Types (updated)
```

## Component Usage Examples

### Using FlightSearchForm

```tsx
import FlightSearchForm from '@/components/FlightSearchForm';

function MyComponent() {
  const handleSearch = (data) => {
    console.log('Search data:', data);
    // Navigate to results or update state
  };

  return (
    <FlightSearchForm 
      onSearch={handleSearch}
      isLoading={false}
    />
  );
}
```

### Using FlightCard

```tsx
import FlightCard from '@/components/FlightCard';

function FlightsList() {
  const flights = [/* flight data */];

  return (
    <div>
      {flights.map(flight => (
        <FlightCard 
          key={flight._id} 
          flight={flight}
          onSelect={(flight) => console.log('Selected:', flight)}
        />
      ))}
    </div>
  );
}
```

### Using Flights Page

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
User adjusts price range
        ↓
Results filtered on client
        ↓
Updated results displayed
        ↓
User selects airline
        ↓
Results filtered further
        ↓
User selects stops preference
        ↓
Final filtered results shown
```

## Sorting Implementation

```typescript
// Sort by price
const sorted = [...flights].sort((a, b) => 
  a.pricing.economy - b.pricing.economy
);

// Sort by duration
const sorted = [...flights].sort((a, b) => 
  a.duration - b.duration
);
```

## Pagination Implementation

```typescript
// Fetch page 1
const response = await apiService.searchFlights({
  ...params,
  page: 1,
  limit: 10
});

// Navigate to page 2
setPage(2);

// Fetch page 2
const response = await apiService.searchFlights({
  ...params,
  page: 2,
  limit: 10
});
```

## Responsive Design Breakpoints

```css
/* Mobile: < 640px */
- Single column layout
- Collapsible filters
- Full-width cards

/* Tablet: 640px - 1024px */
- Two column layout
- Visible filters
- Responsive cards

/* Desktop: > 1024px */
- Three column layout (filters + results)
- Sticky filters
- Large cards
```

## Accessibility Features

- Semantic HTML elements
- ARIA labels for form inputs
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Testing Scenarios

### Manual Testing

1. **Basic Search**
   - [ ] Enter departure and arrival cities
   - [ ] Select dates
   - [ ] Select passengers
   - [ ] Click search
   - [ ] Results display

2. **Filtering**
   - [ ] Adjust price range
   - [ ] Select airline
   - [ ] Select stops preference
   - [ ] Results update correctly

3. **Sorting**
   - [ ] Sort by price
   - [ ] Sort by duration
   - [ ] Results reorder correctly

4. **Pagination**
   - [ ] Navigate to next page
   - [ ] Navigate to previous page
   - [ ] Page indicator updates

5. **Error Handling**
   - [ ] Invalid search shows error
   - [ ] Network error shows message
   - [ ] Empty results show helpful message

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

- Social login not yet implemented
- Payment integration not yet implemented
- Real-time flight availability not implemented
- Advanced filters (cabin class, airlines, etc.) limited

## Future Enhancements

- [ ] Multi-city flights
- [ ] Flexible dates
- [ ] Cabin class selection
- [ ] Airline preferences
- [ ] Price alerts
- [ ] Saved searches
- [ ] Flight status tracking
- [ ] Seat selection
- [ ] Baggage options

## Troubleshooting

### No flights showing
1. Check API URL in `.env.local`
2. Verify backend is running
3. Check browser console for errors
4. Try different search criteria

### Filters not working
1. Refresh the page
2. Clear browser cache
3. Check if flights data is loaded
4. Verify filter values are correct

### Pagination not working
1. Check if results exceed 10
2. Verify page state is updating
3. Check API response format

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Axios](https://axios-http.com)

---

**Status**: ✅ Phase 4 Complete
**Next Phase**: Phase 5 - Accommodation Search & Listing
