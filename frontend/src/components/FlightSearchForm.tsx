'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components';
import { FiNavigation, FiCalendar, FiUsers } from 'react-icons/fi';

interface FlightSearchFormProps {
  onSearch: (data: any) => void;
  isLoading?: boolean;
}

interface SearchFormData {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  children: number;
  infants: number;
  tripType: 'roundtrip' | 'oneway';
}

export default function FlightSearchForm({ onSearch, isLoading = false }: FlightSearchFormProps) {
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SearchFormData>({
    defaultValues: {
      departure: '',
      arrival: '',
      departureDate: '',
      returnDate: '',
      passengers: 1,
      children: 0,
      infants: 0,
      tripType: 'roundtrip',
    },
  });

  const departureDate = watch('departureDate');

  const onSubmit = (data: SearchFormData) => {
    onSearch({
      ...data,
      tripType,
    });
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Trip Type */}
        <div className='flex gap-6'>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              value='roundtrip'
              checked={tripType === 'roundtrip'}
              onChange={(e) => setTripType(e.target.value as 'roundtrip')}
              className='w-4 h-4'
            />
            <span className='text-gray-700'>Round Trip</span>
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              value='oneway'
              checked={tripType === 'oneway'}
              onChange={(e) => setTripType(e.target.value as 'oneway')}
              className='w-4 h-4'
            />
            <span className='text-gray-700'>One Way</span>
          </label>
        </div>

        {/* Search Fields */}
        <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
          {/* Departure */}
          <Input
            label='From'
            placeholder='Departure city'
            icon={<FiNavigation className='w-5 h-5' />}
            error={errors.departure?.message}
            {...register('departure', { required: 'Departure city is required' })}
          />

          {/* Arrival */}
          <Input
            label='To'
            placeholder='Arrival city'
            icon={<FiNavigation className='w-5 h-5' />}
            error={errors.arrival?.message}
            {...register('arrival', { required: 'Arrival city is required' })}
          />

          {/* Departure Date */}
          <Input
            label='Departure'
            type='date'
            icon={<FiCalendar className='w-5 h-5' />}
            error={errors.departureDate?.message}
            {...register('departureDate', { required: 'Departure date is required' })}
          />

          {/* Return Date */}
          {tripType === 'roundtrip' && (
            <Input
              label='Return'
              type='date'
              icon={<FiCalendar className='w-5 h-5' />}
              error={errors.returnDate?.message}
              {...register('returnDate', {
                validate: (value) => {
                  if (tripType === 'roundtrip' && !value) {
                    return 'Return date is required for round trip';
                  }
                  if (value && departureDate && value < departureDate) {
                    return 'Return date must be after departure date';
                  }
                  return true;
                },
              })}
            />
          )}

          {/* Passengers */}
          <div className='md:col-span-5'>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              <FiUsers className='w-4 h-4 inline mr-2' />
              Travelers
            </label>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              {/* Adults */}
              <div>
                <label className='block text-xs text-gray-600 mb-1.5'>Adults (12+)</label>
                <select
                  {...register('passengers', { valueAsNumber: true })}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm'
                >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Adult' : 'Adults'}
                </option>
              ))}
            </select>
              </div>

              {/* Children */}
              <div>
                <label className='block text-xs text-gray-600 mb-1.5'>Children (2-11)</label>
                <select
                  {...register('children', { valueAsNumber: true })}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm'
                >
              {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Child' : num === 0 ? 'No children' : 'Children'}
                </option>
              ))}
            </select>
              </div>

              {/* Infants */}
              <div>
                <label className='block text-xs text-gray-600 mb-1.5'>Infants (under 2)</label>
                <select
                  {...register('infants', { valueAsNumber: true })}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm'
                >
              {[0, 1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Infant' : num === 0 ? 'No infants' : 'Infants'}
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
          Search Flights
        </Button>
      </form>
    </div>
  );
}
