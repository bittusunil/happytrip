'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Layout, Card } from '@/components';
import AccommodationSearchForm from '@/components/AccommodationSearchForm';
import AccommodationCard from '@/components/AccommodationCard';
import { useSearchStore } from '@/store/searchStore';
import { apiService } from '@/services/api';
import { Accommodation, PaginatedResponse } from '@/types';
import { FiFilter, FiAlertCircle } from 'react-icons/fi';
import { mockAccommodations } from '@/data/mockAccommodations';

export default function AccommodationsPage() {
  const searchParams = useSearchParams();
  const { accommodationSearchParams, setAccommodationSearchParams, addRecentSearch } =
    useSearchStore();
  const [accommodations, setAccommodations] = useState<Accommodation[]>(mockAccommodations);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
  });

  // Check if desktop on mount
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Load search params from URL
  useEffect(() => {
    const city = searchParams.get('city');
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const guests = searchParams.get('guests');

    if (city || checkInDate || checkOutDate) {
      setAccommodationSearchParams({
        city: city || '',
        checkInDate: checkInDate || '',
        checkOutDate: checkOutDate || '',
        guests: guests ? parseInt(guests) : 1,
      });
    }
  }, [searchParams, setAccommodationSearchParams]);

  const applyFiltersToMockData = useCallback(() => {
    let filtered = [...mockAccommodations];

    // Apply filters
    if (filters.type !== 'all') {
      filtered = filtered.filter((a) => a.type === filters.type);
    }

    if (filters.minPrice > 0) {
      filtered = filtered.filter((a) => a.pricing.basePrice >= filters.minPrice);
    }

    if (filters.maxPrice < 10000) {
      filtered = filtered.filter((a) => a.pricing.basePrice <= filters.maxPrice);
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter((a) => a.rating.average >= filters.minRating);
    }

    setAccommodations(filtered);
  }, [filters]);

  // Load mock data on mount if no search params
  useEffect(() => {
    if (!accommodationSearchParams.city || !accommodationSearchParams.checkInDate) {
      // Apply filters to mock data
      applyFiltersToMockData();
    }
  }, [filters, accommodationSearchParams.city, accommodationSearchParams.checkInDate, applyFiltersToMockData]);

  // Fetch accommodations
  useEffect(() => {
    if (accommodationSearchParams.city && accommodationSearchParams.checkInDate) {
      fetchAccommodations();
    } else {
      // Show mock data when no search is performed
      applyFiltersToMockData();
    }
  }, [page, accommodationSearchParams, applyFiltersToMockData]);

  const fetchAccommodations = async () => {
    setIsLoading(true);
    try {
      const response: PaginatedResponse<Accommodation> = await apiService.searchAccommodations({
        ...accommodationSearchParams,
        page,
        limit: 10,
      });

      let filtered = response.data;

      // Apply filters
      if (filters.type !== 'all') {
        filtered = filtered.filter((a) => a.type === filters.type);
      }

      if (filters.minPrice > 0) {
        filtered = filtered.filter((a) => a.pricing.basePrice >= filters.minPrice);
      }

      if (filters.maxPrice < 10000) {
        filtered = filtered.filter((a) => a.pricing.basePrice <= filters.maxPrice);
      }

      if (filters.minRating > 0) {
        filtered = filtered.filter((a) => a.rating.average >= filters.minRating);
      }

      setAccommodations(filtered);
      setTotalPages(response.pages);

      // Add to recent searches
      addRecentSearch({
        type: 'accommodation',
        city: accommodationSearchParams.city,
        checkInDate: accommodationSearchParams.checkInDate,
        checkOutDate: accommodationSearchParams.checkOutDate,
        timestamp: new Date(),
      });
    } catch (error: any) {
      toast.error('Failed to search accommodations');
      console.error('Error fetching accommodations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (data: any) => {
    setAccommodationSearchParams({
      city: data.city,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      guests: data.guests,
    });
    setPage(1);
  };

  const accommodationTypes = [
    { value: 'hotel', label: '🏨 Hotel' },
    { value: 'apartment', label: '🏠 Apartment' },
    { value: 'villa', label: '🏡 Villa' },
    { value: 'cottage', label: '🏘️ Cottage' },
    { value: 'resort', label: '🏖️ Resort' },
    { value: 'hostel', label: '🛏️ Hostel' },
  ];

  return (
    <Layout>
      <div className='container-responsive py-12'>
        {/* Search Section */}
        <div className='mb-12'>
          <h1 className='text-3xl font-bold text-gray-900 mb-6'>Find Your Perfect Stay</h1>
          <AccommodationSearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results Section */}
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

              {(showFilters || isDesktop) && (
                <Card>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Filters</h3>

                  {/* Type Filter */}
                  <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Property Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
                    >
                      <option value='all'>All Types</option>
                      {accommodationTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Price Range
                    </label>
                    <div className='space-y-2'>
                      <div>
                        <input
                          type='range'
                          min='0'
                          max='10000'
                          step='100'
                          value={filters.minPrice}
                          onChange={(e) =>
                            setFilters({ ...filters, minPrice: parseInt(e.target.value) })
                          }
                          className='w-full'
                        />
                        <p className='text-xs text-gray-600'>
                          Min: {filters.minPrice} EUR
                        </p>
                      </div>
                      <div>
                        <input
                          type='range'
                          min='0'
                          max='10000'
                          step='100'
                          value={filters.maxPrice}
                          onChange={(e) =>
                            setFilters({ ...filters, maxPrice: parseInt(e.target.value) })
                          }
                          className='w-full'
                        />
                        <p className='text-xs text-gray-600'>
                          Max: {filters.maxPrice} EUR
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Minimum Rating
                    </label>
                    <select
                      value={filters.minRating}
                      onChange={(e) =>
                        setFilters({ ...filters, minRating: parseFloat(e.target.value) })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
                    >
                      <option value='0'>All Ratings</option>
                      <option value='3'>3+ Stars</option>
                      <option value='3.5'>3.5+ Stars</option>
                      <option value='4'>4+ Stars</option>
                      <option value='4.5'>4.5+ Stars</option>
                    </select>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={() => {
                      setFilters({ type: 'all', minPrice: 0, maxPrice: 10000, minRating: 0 });
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
                <p className='text-gray-600'>Searching accommodations...</p>
              </div>
            ) : accommodations.length === 0 ? (
              <Card className='text-center py-12'>
                <FiAlertCircle className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  No accommodations found
                </h3>
                <p className='text-gray-600'>
                  Try adjusting your search criteria or filters
                </p>
              </Card>
            ) : (
              <div className='space-y-4'>
                {/* Results Header */}
                <div className='flex items-center justify-between mb-6'>
                  <p className='text-gray-600'>
                    {accommodationSearchParams.city && accommodationSearchParams.checkInDate
                      ? `Showing ${accommodations.length} accommodation${accommodations.length !== 1 ? 's' : ''}`
                      : `Showing ${accommodations.length} featured accommodation${accommodations.length !== 1 ? 's' : ''}`}
                  </p>
                  <select
                    defaultValue='price'
                    onChange={(e) => {
                      // Sort accommodations
                      const sorted = [...accommodations];
                      if (e.target.value === 'price') {
                        sorted.sort((a, b) => a.pricing.basePrice - b.pricing.basePrice);
                      } else if (e.target.value === 'rating') {
                        sorted.sort((a, b) => b.rating.average - a.rating.average);
                      }
                      setAccommodations(sorted);
                    }}
                    className='px-3 py-2 border border-gray-300 rounded-lg text-sm'
                  >
                    <option value='price'>Sort by Price</option>
                    <option value='rating'>Sort by Rating</option>
                  </select>
                </div>

                {/* Accommodation Cards */}
                {accommodations.map((accommodation) => (
                  <AccommodationCard
                    key={accommodation._id}
                    accommodation={accommodation}
                  />
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
    </Layout>
  );
}
