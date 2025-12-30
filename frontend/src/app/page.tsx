'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <section className='relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white py-24 md:py-32 overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute inset-0' style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className='container-responsive relative z-10'>
          <div className='max-w-3xl'>
            <div className='inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20'>
              <span className='text-sm font-medium'>✨ Your trusted travel companion</span>
            </div>
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight'>
              Discover Your Next
              <span className='block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent'> Adventure</span>
            </h1>
            <p className='text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl'>
              Book flights and accommodations across Europe with HappyTrip. Find the best deals and create unforgettable memories.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link href='/flights'>
                <Button size='lg' className='bg-white !text-primary-600 hover:!bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold'>
                  Search Flights
                </Button>
              </Link>
              <Link href='/accommodations'>
                <Button variant='outline' size='lg' className='!border-2 !border-white/50 !bg-white/10 backdrop-blur-sm hover:!bg-white/20 !text-white hover:!text-white font-semibold'>
                  Find Accommodations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 md:py-28 bg-gradient-to-b from-white to-gray-50/50'>
        <div className='container-responsive'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>Why Choose HappyTrip?</h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Everything you need for your perfect European adventure
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Feature 1 */}
            <div className='group bg-white p-8 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
              <div className='w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/20'>
                <FiNavigation className='w-7 h-7 text-white' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Best Flight Deals</h3>
              <p className='text-gray-600 leading-relaxed'>
                Compare prices from multiple airlines and find the best deals for your journey.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='group bg-white p-8 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
              <div className='w-14 h-14 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary-500/20'>
                <FiHome className='w-7 h-7 text-white' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Wide Selection</h3>
              <p className='text-gray-600 leading-relaxed'>
                Choose from thousands of hotels, apartments, and unique accommodations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='group bg-white p-8 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
              <div className='w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/20'>
                <FiMapPin className='w-7 h-7 text-white' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Easy Navigation</h3>
              <p className='text-gray-600 leading-relaxed'>
                Simple and intuitive interface to find and book your perfect trip.
              </p>
            </div>

            {/* Feature 4 */}
            <div className='group bg-white p-8 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
              <div className='w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/20'>
                <FiTrendingUp className='w-7 h-7 text-white' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Best Price Guarantee</h3>
              <p className='text-gray-600 leading-relaxed'>
                We guarantee the lowest prices or we'll match any competitor's offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className='py-20 md:py-28 bg-white'>
        <div className='container-responsive'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>Popular Destinations</h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Discover the most beautiful cities in Europe
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[
              { 
                name: 'Paris', 
                image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
                alt: 'Eiffel Tower in Paris'
              },
              { 
                name: 'Barcelona', 
                image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
                alt: 'Sagrada Familia in Barcelona'
              },
              { 
                name: 'Rome', 
                image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&h=600&fit=crop',
                alt: 'Colosseum in Rome'
              },
              { 
                name: 'Amsterdam', 
                image: 'https://images.unsplash.com/photo-1534351590666-13e3c96a081b?w=800&h=600&fit=crop',
                alt: 'Canals of Amsterdam'
              },
              { 
                name: 'Berlin', 
                image: 'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?w=800&h=600&fit=crop',
                alt: 'Brandenburg Gate in Berlin'
              },
              { 
                name: 'London', 
                image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
                alt: 'Big Ben and London Eye'
              },
            ].map((destination) => (
              <Link key={destination.name} href={`/accommodations?city=${destination.name}`}>
                <div className='group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer'>
                  <div className='relative h-56 overflow-hidden'>
                    <Image
                      src={destination.image}
                      alt={destination.alt}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-300'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/50 transition-colors duration-300' />
                    <div className='absolute bottom-0 left-0 right-0 p-6'>
                      <h3 className='text-xl font-bold text-white mb-1'>{destination.name}</h3>
                      <p className='text-sm text-white/90'>Explore amazing places</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 md:py-28 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white relative overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute inset-0' style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className='container-responsive text-center relative z-10'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>Ready to Start Your Journey?</h2>
          <p className='text-xl text-white/90 mb-10 max-w-2xl mx-auto'>
            Join thousands of travelers who have discovered amazing destinations with HappyTrip.
          </p>
          <Link href='/register'>
            <Button size='lg' className='bg-white !text-primary-600 hover:!bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 font-semibold'>
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
