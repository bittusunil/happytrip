// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImage?: string;
  language: string;
  currency: string;
  country?: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Flight Types
export interface FlightDeparture {
  airport: string;
  code: string;
  time: string;
  terminal?: string;
}

export interface FlightArrival {
  airport: string;
  code: string;
  time: string;
  terminal?: string;
}

export interface FlightPricing {
  economy: number;
  business: number;
  firstClass: number;
}

export interface Flight {
  _id: string;
  flightNumber: string;
  airline: string;
  departure: FlightDeparture;
  arrival: FlightArrival;
  aircraft: string;
  duration: number;
  stops: number;
  availableSeats: {
    economy: number;
    business: number;
    firstClass: number;
  };
  pricing: FlightPricing;
  currency: string;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Accommodation Types
export interface AccommodationLocation {
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  zipCode?: string;
}

export interface AccommodationRoom {
  type: string;
  count: number;
  basePrice: number;
}

export interface AccommodationPricing {
  basePrice: number;
  currency: string;
  seasonalPrices?: Array<{
    startDate: string;
    endDate: string;
    pricePercentage: number;
  }>;
}

export interface AccommodationRating {
  average: number;
  count: number;
}

export interface AccommodationPolicies {
  checkInTime: string;
  checkOutTime: string;
  cancellation: string;
  minStay: number;
}

export interface Accommodation {
  _id: string;
  name: string;
  description: string;
  type: 'hotel' | 'apartment' | 'villa' | 'cottage' | 'resort' | 'hostel';
  location: AccommodationLocation;
  images: string[];
  amenities: string[];
  rooms: {
    total: number;
    available: number;
    types: AccommodationRoom[];
  };
  pricing: AccommodationPricing;
  rating: AccommodationRating;
  policies: AccommodationPolicies;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  accommodationId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export enum BookingType {
  FLIGHT = 'flight',
  ACCOMMODATION = 'accommodation',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface Booking {
  id: string;
  userId: string;
  type: BookingType;
  status: BookingStatus;
  referenceId: string;
  totalPrice: number;
  currency: string;
  bookingDetails?: Record<string, any>;
  checkInDate?: string;
  checkOutDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Search Types
export interface FlightSearchParams {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate?: string;
  passengers?: number;
  page?: number;
  limit?: number;
}

export interface AccommodationSearchParams {
  city: string;
  checkInDate: string;
  checkOutDate: string;
  guests?: number;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// Filter Types
export interface FlightFilters {
  airline?: string;
  stops?: number;
  priceRange?: [number, number];
  departureTimeRange?: [string, string];
}

export interface AccommodationFilters {
  type?: string;
  priceRange?: [number, number];
  rating?: number;
  amenities?: string[];
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
