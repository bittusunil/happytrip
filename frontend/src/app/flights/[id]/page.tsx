'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Layout, Card, Button } from '@/components';
import { Flight } from '@/types';
import { apiService } from '@/services/api';
import { mockFlights } from '@/data/mockFlights';
import {
  FiArrowLeft,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiUsers,
  FiWifi,
  FiCoffee,
  FiHeadphones,
  FiZap,
  FiCheck,
  FiX,
} from 'react-icons/fi';

export default function FlightDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [flight, setFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCabin, setSelectedCabin] = useState<'economy' | 'business' | 'firstClass'>('economy');
  const [passengers, setPassengers] = useState(1);

  useEffect(() => {
    if (id) {
      fetchFlight();
    }
  }, [id]);

  const fetchFlight = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from API first, fallback to mock data
      try {
        const response = await apiService.getFlightById(id);
        if (response.data) {
          setFlight(response.data);
        } else {
          const mockFlight = mockFlights.find((f) => f._id === id);
          if (mockFlight) {
            setFlight(mockFlight);
          }
        }
      } catch (error) {
        // Fallback to mock data
        const mockFlight = mockFlights.find((f) => f._id === id);
        if (mockFlight) {
          setFlight(mockFlight);
        } else {
          toast.error('Flight not found');
          router.push('/flights');
        }
      }
    } catch (error) {
      console.error('Error fetching flight:', error);
      toast.error('Failed to load flight details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!flight) return;

    const totalPrice = flight.pricing[selectedCabin] * passengers;

    // Navigate to booking form with pre-filled data
    router.push(
      `/bookings/new?type=flight&referenceId=${flight._id}&departureDate=${flight.departure.time}&arrivalDate=${flight.arrival.time}&passengers=${passengers}&cabinClass=${selectedCabin}&totalPrice=${totalPrice}&currency=${flight.currency}`
    );
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <FiWifi className='w-5 h-5' />,
    meals: <FiCoffee className='w-5 h-5' />,
    entertainment: <FiHeadphones className='w-5 h-5' />,
    'usb charging': <FiZap className='w-5 h-5' />,
    'seat selection': <FiCheck className='w-5 h-5' />,
    'lounge access': <FiCheck className='w-5 h-5' />,
    shower: <FiCheck className='w-5 h-5' />,
  };

  if (isLoading) {
    return (
      <Layout>
        <div className='container-responsive py-12'>
          <div className='text-center py-20'>
            <p className='text-gray-600'>Loading flight details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!flight) {
    return (
      <Layout>
        <div className='container-responsive py-12'>
          <Card className='text-center py-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Flight not found</h2>
            <Link href='/flights'>
              <Button>Back to Flights</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  const availableSeats = flight.availableSeats[selectedCabin];
  const pricePerPerson = flight.pricing[selectedCabin];
  const totalPrice = pricePerPerson * passengers;

  return (
    <Layout>
      <div className='container-responsive py-8'>
        {/* Back Button */}
        <Link href='/flights' className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'>
          <FiArrowLeft className='w-4 h-4' />
          Back to Flights
        </Link>

        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-start justify-between mb-4'>
            <div>
              <h1 className='text-4xl font-bold text-gray-900 mb-2'>
                {flight.airline} Flight {flight.flightNumber}
              </h1>
              <p className='text-gray-600'>
                {flight.departure.airport} → {flight.arrival.airport}
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Flight Route Card */}
            <Card>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Flight Details</h2>

              {/* Route Display */}
              <div className='flex items-center gap-6 mb-8'>
                {/* Departure */}
                <div className='flex-1'>
                  <div className='mb-2'>
                    <p className='text-4xl font-bold text-gray-900'>{flight.departure.code}</p>
                    <p className='text-sm text-gray-600'>{flight.departure.airport}</p>
                  </div>
                  <div className='mt-4'>
                    <p className='text-2xl font-semibold text-gray-900'>{formatTime(flight.departure.time)}</p>
                    <p className='text-sm text-gray-600'>{formatDate(flight.departure.time)}</p>
                    {flight.departure.terminal && (
                      <p className='text-xs text-gray-500 mt-1'>Terminal {flight.departure.terminal}</p>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className='text-center'>
                  <div className='flex items-center justify-center gap-2 mb-2'>
                    <div className='flex-1 h-px bg-gray-300' />
                    <FiNavigation className='w-6 h-6 text-primary-600 rotate-90' />
                    <div className='flex-1 h-px bg-gray-300' />
                  </div>
                  <p className='text-sm font-medium text-gray-700'>{formatDuration(flight.duration)}</p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </p>
                </div>

                {/* Arrival */}
                <div className='flex-1 text-right'>
                  <div className='mb-2'>
                    <p className='text-4xl font-bold text-gray-900'>{flight.arrival.code}</p>
                    <p className='text-sm text-gray-600'>{flight.arrival.airport}</p>
                  </div>
                  <div className='mt-4'>
                    <p className='text-2xl font-semibold text-gray-900'>{formatTime(flight.arrival.time)}</p>
                    <p className='text-sm text-gray-600'>{formatDate(flight.arrival.time)}</p>
                    {flight.arrival.terminal && (
                      <p className='text-xs text-gray-500 mt-1'>Terminal {flight.arrival.terminal}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Aircraft Info */}
              <div className='pt-6 border-t border-gray-200'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600 mb-1'>Aircraft</p>
                    <p className='font-semibold text-gray-900'>{flight.aircraft}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-gray-600 mb-1'>Flight Number</p>
                    <p className='font-semibold text-gray-900'>{flight.flightNumber}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Amenities */}
            <Card>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Amenities</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {flight.amenities.map((amenity, index) => {
                  const amenityKey = amenity.toLowerCase();
                  const icon = amenityIcons[amenityKey] || <FiCheck className='w-5 h-5' />;
                  return (
                    <div key={index} className='flex items-center gap-3'>
                      <div className='text-primary-600'>{icon}</div>
                      <span className='text-gray-700'>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Cabin Classes */}
            <Card>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Cabin Classes & Pricing</h2>
              <div className='space-y-4'>
                {/* Economy */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedCabin === 'economy'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCabin('economy')}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-1'>Economy Class</h3>
                      <p className='text-sm text-gray-600'>
                        {flight.availableSeats.economy} seats available
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-xl font-bold text-primary-600'>
                        {flight.pricing.economy.toFixed(2)} {flight.currency}
                      </p>
                      <p className='text-xs text-gray-600'>per person</p>
                    </div>
                  </div>
                </div>

                {/* Business */}
                {flight.pricing.business > 0 && (
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedCabin === 'business'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCabin('business')}
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-semibold text-gray-900 mb-1'>Business Class</h3>
                        <p className='text-sm text-gray-600'>
                          {flight.availableSeats.business} seats available
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-xl font-bold text-primary-600'>
                          {flight.pricing.business.toFixed(2)} {flight.currency}
                        </p>
                        <p className='text-xs text-gray-600'>per person</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* First Class */}
                {flight.pricing.firstClass > 0 && (
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedCabin === 'firstClass'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCabin('firstClass')}
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-semibold text-gray-900 mb-1'>First Class</h3>
                        <p className='text-sm text-gray-600'>
                          {flight.availableSeats.firstClass} seats available
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-xl font-bold text-primary-600'>
                          {flight.pricing.firstClass.toFixed(2)} {flight.currency}
                        </p>
                        <p className='text-xs text-gray-600'>per person</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-20'>
              <Card>
                <h2 className='text-xl font-bold text-gray-900 mb-6'>Book Your Flight</h2>

                {/* Cabin Selection */}
                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Cabin Class
                  </label>
                  <select
                    value={selectedCabin}
                    onChange={(e) =>
                      setSelectedCabin(e.target.value as 'economy' | 'business' | 'firstClass')
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
                  >
                    {flight.pricing.economy > 0 && (
                      <option value='economy'>
                        Economy - {flight.pricing.economy.toFixed(2)} {flight.currency}
                      </option>
                    )}
                    {flight.pricing.business > 0 && (
                      <option value='business'>
                        Business - {flight.pricing.business.toFixed(2)} {flight.currency}
                      </option>
                    )}
                    {flight.pricing.firstClass > 0 && (
                      <option value='firstClass'>
                        First Class - {flight.pricing.firstClass.toFixed(2)} {flight.currency}
                      </option>
                    )}
                  </select>
                </div>

                {/* Passengers */}
                <div className='mb-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <FiUsers className='w-4 h-4 inline mr-1' />
                    Passengers
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability Warning */}
                {availableSeats < passengers && (
                  <div className='mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                    <p className='text-sm text-yellow-800'>
                      Only {availableSeats} {availableSeats === 1 ? 'seat' : 'seats'} available in{' '}
                      {selectedCabin === 'economy'
                        ? 'Economy'
                        : selectedCabin === 'business'
                        ? 'Business'
                        : 'First Class'}
                    </p>
                  </div>
                )}

                {/* Price Summary */}
                <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                  <div className='flex justify-between text-sm mb-2'>
                    <span className='text-gray-600'>
                      {passengers} {passengers === 1 ? 'passenger' : 'passengers'} ×{' '}
                      {pricePerPerson.toFixed(2)} {flight.currency}
                    </span>
                    <span className='text-gray-900'>{totalPrice.toFixed(2)} {flight.currency}</span>
                  </div>
                  <div className='flex justify-between pt-2 border-t border-gray-200'>
                    <span className='font-semibold text-gray-900'>Total</span>
                    <span className='text-2xl font-bold text-primary-600'>
                      {totalPrice.toFixed(2)} {flight.currency}
                    </span>
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  fullWidth
                  onClick={handleBookNow}
                  size='lg'
                  disabled={availableSeats < passengers}
                >
                  {availableSeats < passengers ? 'Not Enough Seats' : 'Book Now'}
                </Button>

                <p className='text-xs text-gray-500 text-center mt-4'>
                  You won't be charged yet
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
