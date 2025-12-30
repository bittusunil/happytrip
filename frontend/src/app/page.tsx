'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import { FiNavigation, FiHome, FiMapPin, FiTrendingUp } from 'react-icons/fi';

export default function Home() {
  const { loadUserFromStorage } = useAuthStore();

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20'>
        <div className='container-responsive'>
          <div className='max-w-2xl'>
            <h1 className='text-5xl font-bold mb-4'>
              Discover Your Next Adventure
            </h1>
            <p className='text-xl text-primary-100 mb-8'>
              Book flights and accommodations across Europe with HappyTrip. Find the best deals and create unforgettable memories.
            </p>
            <div className='flex gap-4'>
              <Link href='/flights'>
                <Button size='lg'>Search Flights</Button>
              </Link>
              <Link href='/accommodations'>
                <Button variant='outline' size='lg'>
                  Find Accommodations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-gray-50'>
        <div className='container-responsive'>
          <h2 className='text-3xl font-bold text-center mb-12'>Why Choose HappyTrip?</h2>
          <div className='grid-responsive'>
            {/* Feature 1 */}
            <div className='bg-white p-6 rounded-lg shadow-card hover:shadow-card-hover transition'>
              <div className='w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4'>
                <FiNavigation className='w-6 h-6 text-primary-500' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Best Flight Deals</h3>
              <p className='text-gray-600'>
                Compare prices from multiple airlines and find the best deals for your journey.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='bg-white p-6 rounded-lg shadow-card hover:shadow-card-hover transition'>
              <div className='w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4'>
                <FiHome className='w-6 h-6 text-primary-500' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Wide Selection</h3>
              <p className='text-gray-600'>
                Choose from thousands of hotels, apartments, and unique accommodations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='bg-white p-6 rounded-lg shadow-card hover:shadow-card-hover transition'>
              <div className='w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4'>
                <FiMapPin className='w-6 h-6 text-primary-500' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Easy Navigation</h3>
              <p className='text-gray-600'>
                Simple and intuitive interface to find and book your perfect trip.
              </p>
            </div>

            {/* Feature 4 */}
            <div className='bg-white p-6 rounded-lg shadow-card hover:shadow-card-hover transition'>
              <div className='w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4'>
                <FiTrendingUp className='w-6 h-6 text-primary-500' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Best Price Guarantee</h3>
              <p className='text-gray-600'>
                We guarantee the lowest prices or we'll match any competitor's offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-primary-50'>
        <div className='container-responsive text-center'>
          <h2 className='text-3xl font-bold mb-4'>Ready to Start Your Journey?</h2>
          <p className='text-gray-600 mb-8 max-w-2xl mx-auto'>
            Join thousands of travelers who have discovered amazing destinations with HappyTrip.
          </p>
          <Link href='/register'>
            <Button size='lg'>Get Started Today</Button>
          </Link>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className='py-16'>
        <div className='container-responsive'>
          <h2 className='text-3xl font-bold mb-12'>Popular Destinations</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[
              { name: 'Paris', image: '🗼' },
              { name: 'Barcelona', image: '🏖️' },
              { name: 'Rome', image: '🏛️' },
              { name: 'Amsterdam', image: '🚲' },
              { name: 'Berlin', image: '🏰' },
              { name: 'London', image: '🇬🇧' },
            ].map((destination) => (
              <Link key={destination.name} href={`/accommodations?city=${destination.name}`}>
                <div className='bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition cursor-pointer'>
                  <div className='h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-6xl'>
                    {destination.image}
                  </div>
                  <div className='p-4'>
                    <h3 className='text-lg font-semibold'>{destination.name}</h3>
                    <p className='text-sm text-gray-600'>Explore amazing places</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
