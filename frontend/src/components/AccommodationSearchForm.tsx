'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components';
import { FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';

interface AccommodationSearchFormProps {
  onSearch: (data: any) => void;
  isLoading?: boolean;
}

interface SearchFormData {
  city: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  rooms: number;
}

export default function AccommodationSearchForm({
  onSearch,
  isLoading = false,
}: AccommodationSearchFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SearchFormData>({
    defaultValues: {
      city: '',
      checkInDate: '',
      checkOutDate: '',
      guests: 1,
      rooms: 1,
    },
  });

  const checkInDate = watch('checkInDate');

  const onSubmit = (data: SearchFormData) => {
    onSearch(data);
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Search Fields */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          {/* City */}
          <Input
            label='Where to?'
            placeholder='City name'
            icon={<FiMapPin className='w-5 h-5' />}
            error={errors.city?.message}
            {...register('city', { required: 'City is required' })}
          />

          {/* Check-in Date */}
          <Input
            label='Check-in'
            type='date'
            icon={<FiCalendar className='w-5 h-5' />}
            error={errors.checkInDate?.message}
            {...register('checkInDate', { required: 'Check-in date is required' })}
          />

          {/* Check-out Date */}
          <Input
            label='Check-out'
            type='date'
            icon={<FiCalendar className='w-5 h-5' />}
            error={errors.checkOutDate?.message}
            {...register('checkOutDate', {
              required: 'Check-out date is required',
              validate: (value) => {
                if (checkInDate && value <= checkInDate) {
                  return 'Check-out must be after check-in';
                }
                return true;
              },
            })}
          />

          {/* Rooms & Guests */}
          <div className='md:col-span-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Rooms */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Rooms
                </label>
                <select
                  {...register('rooms', { valueAsNumber: true })}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Room' : 'Rooms'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guests */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <FiUsers className='w-4 h-4 inline mr-2' />
                  Guests
                </label>
                <select
                  {...register('guests', { valueAsNumber: true })}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button
          type='submit'
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          Search Accommodations
        </Button>
      </form>
    </div>
  );
}
