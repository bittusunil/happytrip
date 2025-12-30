'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Layout, Card } from '@/components';
import FlightSearchForm from '@/components/FlightSearchForm';
import FlightCard from '@/components/FlightCard';
import { useSearchStore } from '@/store/searchStore';
import { apiService } from '@/services/api';
import { Flight, PaginatedResponse } from '@/types';
import { FiFilter, FiAlertCircle } from 'react-icons/fi';
import { mockFlights } from '@/data/mockFlights';

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const { flightSearchParams, setFlightSearchParams, addRecentSearch } = useSearchStore();
  const [flights, setFlights] = useState<Flight[]>(mockFlights);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: 10000,
    airline: '',
    stops: 'all',
  });

  // Load search params from URL
  useEffect(() => {
    const departure = searchParams.get('departure');
    const arrival = searchParams.get('arrival');
    const departureDate = searchParams.get('departureDate');
    const passengers = searchParams.get('passengers');

    if (departure || arrival || departureDate) {
      setFlightSearchParams({
        departure: departure || '',
        arrival: arrival || '',
        departureDate: departureDate || '',
        passengers: passengers ? parseInt(passengers) : 1,
      });
    }
  }, [searchParams, setFlightSearchParams]);

  // Load mock data on mount if no search params
  useEffect(() => {
    if (!flightSearchParams.departure || !flightSearchParams.arrival || !flightSearchParams.departureDate) {
      // Apply filters to mock data
      applyFiltersToMockData();
    }
  }, [filters]);

  // Fetch flights
  useEffect(() => {
    if (flightSearchParams.departure && flightSearchParams.arrival && flightSearchParams.departureDate) {
      fetchFlights();
    } else {
      // Show mock data when no search is performed
      applyFiltersToMockData();
    }
  }, [page, flightSearchParams]);

  const applyFiltersToMockData = () => {
    let filtered = [...mockFlights];

    // Apply filters
    if (filters.maxPrice < 10000) {
      filtered = filtered.filter((f) => f.pricing.economy <= filters.maxPrice);
    }

    if (filters.airline) {
      filtered = filtered.filter((f) => f.airline.toLowerCase() === filters.airline.toLowerCase());
    }

    if (filters.stops !== 'all') {
      const stopsCount = parseInt(filters.stops);
      filtered = filtered.filter((f) => f.stops === stopsCount);
    }

    setFlights(filtered);
  };

  const fetchFlights = async () => {
    setIsLoading(true);
    try {
      const response: PaginatedResponse<Flight> = await apiService.searchFlights({
        ...flightSearchParams,
        page,
        limit: 10,
      });

      let filtered = response.data;

      // Apply filters
      if (filters.maxPrice < 10000) {
        filtered = filtered.filter((f) => f.pricing.economy <= filters.maxPrice);
      }

      if (filters.airline) {
        filtered = filtered.filter((f) => f.airline.toLowerCase() === filters.airline.toLowerCase());
      }

      if (filters.stops !== 'all') {
        const stopsCount = parseInt(filters.stops);
        filtered = filtered.filter((f) => f.stops === stopsCount);
      }

      setFlights(filtered);
      setTotalPages(response.pages);

      // Add to recent searches
      addRecentSearch({
        type: 'flight',
        departure: flightSearchParams.departure,
        arrival: flightSearchParams.arrival,
        date: flightSearchParams.departureDate,
        timestamp: new Date(),
      });
    } catch (error: any) {
      toast.error('Failed to search flights');
      console.error('Error fetching flights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (data: any) => {
    setFlightSearchParams({
      departure: data.departure,
      arrival: data.arrival,
      departureDate: data.departureDate,
      returnDate: data.returnDate,
      passengers: data.passengers,
    });
    setPage(1);
  };

  const airlines = Array.from(new Set(flights.map((f) => f.airline)));

  return (
    <Layout>
      <div className='container-responsive py-12'>
        {/* Search Section */}
        <div className='mb-12'>
          <h1 className='text-3xl font-bold text-gray-900 mb-6'>Search Flights</h1>
          <FlightSearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results Section */}
        <div>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Filters Sidebar */}
            <div className='lg:col-span-1'>
              <div className='sticky top-20'>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className='lg:hidden w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg mb-4'
                >
                  <FiFilter className='w-4 h-4' />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>

                {(showFilters || window.innerWidth >= 1024) && (
                  <Card>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Filters</h3>

                    {/* Price Filter */}
                    <div className='mb-6'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Max Price: {filters.maxPrice} EUR
                      </label>
                      <input
                        type='range'
                        min='0'
                        max='10000'
                        step='100'
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                        className='w-full'
                      />
                    </div>

                    {/* Airline Filter */}
                    {airlines.length > 0 && (
                      <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Airline
                        </label>
                        <select
                          value={filters.airline}
                          onChange={(e) => setFilters({ ...filters, airline: e.target.value })}
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
                        >
                          <option value=''>All Airlines</option>
                          {airlines.map((airline) => (
                            <option key={airline} value={airline}>
                              {airline}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Stops Filter */}
                    <div className='mb-6'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Stops
                      </label>
                      <select
                        value={filters.stops}
                        onChange={(e) => setFilters({ ...filters, stops: e.target.value })}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
                      >
                        <option value='all'>All Flights</option>
                        <option value='0'>Non-stop</option>
                        <option value='1'>1 Stop</option>
                        <option value='2'>2+ Stops</option>
                      </select>
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={() => {
                        setFilters({ maxPrice: 10000, airline: '', stops: 'all' });
                      }}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50'
                    >
                      Reset Filters
                    </button>
                  </Card>
                )}
              </div>
            </div>

            {/* Results */}
            <div className='lg:col-span-3'>
              {isLoading ? (
                <div className='text-center py-12'>
                  <p className='text-gray-600'>Searching flights...</p>
                </div>
              ) : flights.length === 0 ? (
                <Card className='text-center py-12'>
                  <FiAlertCircle className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>No flights found</h3>
                  <p className='text-gray-600'>
                    Try adjusting your search criteria or filters
                  </p>
                </Card>
              ) : (
                <div className='space-y-4'>
                  {/* Results Header */}
                  <div className='flex items-center justify-between mb-6'>
                    <p className='text-gray-600'>
                      {flightSearchParams.departure && flightSearchParams.arrival
                        ? `Showing ${flights.length} flight${flights.length !== 1 ? 's' : ''}`
                        : `Showing ${flights.length} featured flight${flights.length !== 1 ? 's' : ''}`}
                    </p>
                    <select
                      defaultValue='price'
                      onChange={(e) => {
                        // Sort flights
                        const sorted = [...flights];
                        if (e.target.value === 'price') {
                          sorted.sort((a, b) => a.pricing.economy - b.pricing.economy);
                        } else if (e.target.value === 'duration') {
                          sorted.sort((a, b) => a.duration - b.duration);
                        }
                        setFlights(sorted);
                      }}
                      className='px-3 py-2 border border-gray-300 rounded-lg text-sm'
                    >
                      <option value='price'>Sort by Price</option>
                      <option value='duration'>Sort by Duration</option>
                    </select>
                  </div>

                  {/* Flight Cards */}
                  {flights.map((flight) => (
                    <FlightCard key={flight._id} flight={flight} />
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className='flex items-center justify-center gap-4 mt-8'>
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50'
                      >
                        Previous
                      </button>
                      <span className='text-gray-600'>
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50'
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
