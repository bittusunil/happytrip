'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Accommodation } from '@/types';
import { Button, Card } from '@/components';
import { FiStar, FiMapPin, FiWifi, FiCoffee, FiSwimmer } from 'react-icons/fi';

interface AccommodationCardProps {
  accommodation: Accommodation;
  onSelect?: (accommodation: Accommodation) => void;
}

export default function AccommodationCard({
  accommodation,
  onSelect,
}: AccommodationCardProps) {
  const [imageError, setImageError] = useState(false);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      hotel: '🏨',
      apartment: '🏠',
      villa: '🏡',
      cottage: '🏘️',
      resort: '🏖️',
      hostel: '🛏️',
    };
    return icons[type] || '🏨';
  };

  const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <FiWifi className='w-4 h-4' />,
    coffee: <FiCoffee className='w-4 h-4' />,
    pool: <FiSwimmer className='w-4 h-4' />,
  };

  return (
    <Card hoverable>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Image */}
        <div className='relative h-48 md:h-full md:col-span-1 bg-gray-200 rounded-lg overflow-hidden'>
          {!imageError && accommodation.images.length > 0 ? (
            <img
              src={accommodation.images[0]}
              alt={accommodation.name}
              className='w-full h-full object-cover'
              onError={() => setImageError(true)}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200'>
              <span className='text-4xl'>{getTypeIcon(accommodation.type)}</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className='md:col-span-2 flex flex-col justify-between'>
          {/* Header */}
          <div className='mb-4'>
            <div className='flex items-start justify-between mb-2'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900'>{accommodation.name}</h3>
                <p className='text-sm text-gray-600 flex items-center gap-1 mt-1'>
                  <FiMapPin className='w-4 h-4' />
                  {accommodation.location.city}, {accommodation.location.country}
                </p>
              </div>
              <div className='text-right'>
                <div className='flex items-center gap-1'>
                  <FiStar className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                  <span className='font-semibold text-gray-900'>
                    {accommodation.rating.average.toFixed(1)}
                  </span>
                </div>
                <p className='text-xs text-gray-600'>
                  ({accommodation.rating.count} reviews)
                </p>
              </div>
            </div>

            {/* Type */}
            <p className='text-sm text-gray-600 capitalize'>
              {accommodation.type} • {accommodation.rooms.total} rooms
            </p>
          </div>

          {/* Description */}
          {accommodation.description && (
            <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
              {accommodation.description}
            </p>
          )}

          {/* Amenities */}
          {accommodation.amenities.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-4'>
              {accommodation.amenities.slice(0, 4).map((amenity, index) => (
                <div
                  key={index}
                  className='flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded'
                >
                  {amenityIcons[amenity.toLowerCase()] || '✓'}
                  <span>{amenity}</span>
                </div>
              ))}
              {accommodation.amenities.length > 4 && (
                <div className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'>
                  +{accommodation.amenities.length - 4} more
                </div>
              )}
            </div>
          )}

          {/* Pricing & Action */}
          <div className='flex items-end justify-between'>
            <div>
              <p className='text-xs text-gray-600'>From</p>
              <p className='text-2xl font-bold text-primary-600'>
                {accommodation.pricing.basePrice.toFixed(2)}
              </p>
              <p className='text-xs text-gray-600'>
                {accommodation.pricing.currency} per night
              </p>
            </div>

            <div className='flex gap-2'>
              <Link href={`/accommodations/${accommodation._id}`}>
                <Button size='sm'>View Details</Button>
              </Link>
              {onSelect && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onSelect(accommodation)}
                >
                  Select
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
