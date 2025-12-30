'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { FiHome, FiNavigation, FiMapPin, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <Layout>
      <div className='min-h-[calc(100vh-200px)] flex items-center justify-center py-16'>
        <div className='container-responsive'>
          <div className='max-w-2xl mx-auto text-center'>
            {/* 404 Number */}
            <div className='mb-8'>
              <h1 className='text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600 leading-none'>
                404
              </h1>
            </div>

            {/* Error Message */}
            <div className='mb-8'>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                Oops! Page Not Found
              </h2>
              <p className='text-lg text-gray-600 mb-2'>
                The page you're looking for seems to have taken a detour.
              </p>
              <p className='text-gray-500'>
                Don't worry, let's get you back on track!
              </p>
            </div>

            {/* Illustration/Icon */}
            <div className='mb-12 flex justify-center'>
              <div className='relative'>
                <div className='w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center'>
                  <FiNavigation className='w-16 h-16 text-primary-500 animate-pulse' />
                </div>
                <div className='absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce'>
                  <span className='text-xl'>🗺️</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
              <Link href='/'>
                <Button size='lg' className='w-full sm:w-auto'>
                  <FiHome className='w-5 h-5 mr-2 inline' />
                  Go Home
                </Button>
              </Link>
              <Button
                variant='outline'
                size='lg'
                onClick={() => window.history.back()}
                className='w-full sm:w-auto'
              >
                <FiArrowLeft className='w-5 h-5 mr-2 inline' />
                Go Back
              </Button>
            </div>

            {/* Quick Links */}
            <div className='border-t border-gray-200 pt-8'>
              <p className='text-sm text-gray-600 mb-4'>Or explore our popular pages:</p>
              <div className='flex flex-wrap justify-center gap-4'>
                <Link
                  href='/flights'
                  className='flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition'
                >
                  <FiNavigation className='w-4 h-4' />
                  <span>Search Flights</span>
                </Link>
                <Link
                  href='/accommodations'
                  className='flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition'
                >
                  <FiMapPin className='w-4 h-4' />
                  <span>Find Accommodations</span>
                </Link>
                <Link
                  href='/about'
                  className='flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition'
                >
                  <span>About Us</span>
                </Link>
              </div>
            </div>

            {/* Fun Message */}
            <div className='mt-12 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg'>
              <p className='text-gray-700 italic'>
                "Not all those who wander are lost, but you might be! 😄"
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
