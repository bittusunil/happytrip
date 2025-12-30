'use client';

import React from 'react';
import Link from 'next/link';
import { Flight } from '@/types';
import { Button, Card } from '@/components';
import { FiClock, FiMapPin, FiNavigation } from 'react-icons/fi';

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
}

export default function FlightCard({ flight, onSelect }: FlightCardProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const minutes = Math.floor((endTime - startTime) / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card hoverable>
      <div className='flex flex-col md:flex-row md:items-center gap-4'>
        {/* Flight Info */}
        <div className='flex-1'>
          {/* Header */}
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-sm text-gray-600'>{flight.airline}</p>
              <p className='text-xs text-gray-500'>Flight {flight.flightNumber}</p>
            </div>
            <div className='text-right'>
              <p className='text-sm font-medium text-gray-900'>
                {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {/* Route */}
          <div className='flex items-center gap-4 mb-4'>
            {/* Departure */}
            <div className='flex-1'>
              <p className='text-2xl font-bold text-gray-900'>{flight.departure.code}</p>
              <p className='text-sm text-gray-600'>{formatTime(flight.departure.time)}</p>
              <p className='text-xs text-gray-500'>{formatDate(flight.departure.time)}</p>
            </div>

            {/* Duration */}
            <div className='text-center'>
              <div className='flex items-center justify-center gap-2 mb-2'>
                <div className='flex-1 h-px bg-gray-300' />
                <FiNavigation className='w-4 h-4 text-gray-400 rotate-90' />
                <div className='flex-1 h-px bg-gray-300' />
              </div>
              <p className='text-xs text-gray-600'>
                {calculateDuration(flight.departure.time, flight.arrival.time)}
              </p>
            </div>

            {/* Arrival */}
            <div className='flex-1 text-right'>
              <p className='text-2xl font-bold text-gray-900'>{flight.arrival.code}</p>
              <p className='text-sm text-gray-600'>{formatTime(flight.arrival.time)}</p>
              <p className='text-xs text-gray-500'>{formatDate(flight.arrival.time)}</p>
            </div>
          </div>

          {/* Details */}
          <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
            <div className='flex items-center gap-1'>
              <FiMapPin className='w-4 h-4' />
              <span>{flight.aircraft}</span>
            </div>
            <div className='flex items-center gap-1'>
              <FiClock className='w-4 h-4' />
              <span>{flight.availableSeats.economy} seats available</span>
            </div>
          </div>

          {/* Amenities */}
          {flight.amenities.length > 0 && (
            <div className='mt-3 flex flex-wrap gap-2'>
              {flight.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className='px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded'
                >
                  {amenity}
                </span>
              ))}
              {flight.amenities.length > 3 && (
                <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'>
                  +{flight.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Action */}
        <div className='md:text-right md:border-l md:border-gray-200 md:pl-4 md:min-w-max'>
          <div className='mb-4'>
            <p className='text-xs text-gray-600 mb-1'>From</p>
            <p className='text-3xl font-bold text-primary-600'>
              {flight.pricing.economy.toFixed(2)}
            </p>
            <p className='text-xs text-gray-600'>{flight.currency} per person</p>
          </div>

          <div className='space-y-2'>
            <Link href={`/flights/${flight._id}`}>
              <Button fullWidth size='sm'>
                View Details
              </Button>
            </Link>
            {onSelect && (
              <Button
                variant='outline'
                fullWidth
                size='sm'
                onClick={() => onSelect(flight)}
              >
                Select
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
