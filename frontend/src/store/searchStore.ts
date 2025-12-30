import { create } from 'zustand';
import { FlightSearchParams, AccommodationSearchParams } from '@/types';

interface SearchState {
  // Flight Search
  flightSearchParams: FlightSearchParams;
  setFlightSearchParams: (params: Partial<FlightSearchParams>) => void;

  // Accommodation Search
  accommodationSearchParams: AccommodationSearchParams;
  setAccommodationSearchParams: (params: Partial<AccommodationSearchParams>) => void;

  // Preferences
  currency: string;
  language: string;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;

  // Recent Searches
  recentSearches: any[];
  addRecentSearch: (search: any) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  // Flight Search
  flightSearchParams: {
    departure: '',
    arrival: '',
    departureDate: '',
    passengers: 1,
    page: 1,
    limit: 10,
  },
  setFlightSearchParams: (params: Partial<FlightSearchParams>) => {
    set((state) => ({
      flightSearchParams: {
        ...state.flightSearchParams,
        ...params,
      },
    }));
  },

  // Accommodation Search
  accommodationSearchParams: {
    city: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    page: 1,
    limit: 10,
  },
  setAccommodationSearchParams: (params: Partial<AccommodationSearchParams>) => {
    set((state) => ({
      accommodationSearchParams: {
        ...state.accommodationSearchParams,
        ...params,
      },
    }));
  },

  // Preferences
  currency: 'EUR',
  language: 'en',
  setCurrency: (currency: string) => {
    set({ currency });
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', currency);
    }
  },
  setLanguage: (language: string) => {
    set({ language });
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  },

  // Recent Searches
  recentSearches: [],
  addRecentSearch: (search: any) => {
    set((state) => {
      const updated = [search, ...state.recentSearches].slice(0, 5);
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentSearches', JSON.stringify(updated));
      }
      return { recentSearches: updated };
    });
  },
  clearRecentSearches: () => {
    set({ recentSearches: [] });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches');
    }
  },
}));
