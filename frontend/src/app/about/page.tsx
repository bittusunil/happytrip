'use client';

import React from 'react';
import Layout from '@/components/Layout';
import { FiHeart, FiGlobe, FiAward, FiUsers, FiShield, FiTrendingUp } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16'>
        <div className='container-responsive'>
          <div className='max-w-3xl mx-auto text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>About HappyTrip</h1>
            <p className='text-xl text-primary-100'>
              Your trusted travel companion for flights and accommodations across Europe
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className='py-16 bg-white'>
        <div className='container-responsive'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>Our Mission</h2>
              <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                At HappyTrip, we believe that travel should be accessible, enjoyable, and stress-free. 
                Our mission is to make it easy for everyone to discover amazing destinations, find the best deals, 
                and create unforgettable memories across Europe.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <FiHeart className='w-8 h-8 text-primary-500' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>Passion for Travel</h3>
                <p className='text-gray-600'>
                  We're passionate about connecting people with amazing destinations and experiences.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <FiGlobe className='w-8 h-8 text-primary-500' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>European Focus</h3>
                <p className='text-gray-600'>
                  Specializing in European travel with deep knowledge of local destinations and cultures.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <FiAward className='w-8 h-8 text-primary-500' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>Best Value</h3>
                <p className='text-gray-600'>
                  Committed to providing the best prices and value for all your travel needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className='py-16 bg-gray-50'>
        <div className='container-responsive'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-gray-900 text-center mb-12'>Our Values</h2>
            
            <div className='space-y-6'>
              <div className='bg-white p-6 rounded-lg shadow-card'>
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <FiShield className='w-6 h-6 text-primary-500' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>Trust & Security</h3>
                    <p className='text-gray-600'>
                      Your security and privacy are our top priorities. We use industry-leading encryption 
                      and security measures to protect your personal information and payment details.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-card'>
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <FiUsers className='w-6 h-6 text-primary-500' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>Customer First</h3>
                    <p className='text-gray-600'>
                      We put our customers at the heart of everything we do. Our dedicated support team 
                      is available 24/7 to help you with any questions or concerns.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-card'>
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <FiTrendingUp className='w-6 h-6 text-primary-500' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>Innovation</h3>
                    <p className='text-gray-600'>
                      We continuously innovate to improve your travel experience with the latest technology 
                      and features, making booking easier and more convenient.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-white'>
        <div className='container-responsive'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-gray-900 text-center mb-12'>Why Choose HappyTrip?</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='p-6 border border-gray-200 rounded-lg hover:shadow-card-hover transition'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Wide Selection</h3>
                <p className='text-gray-600'>
                  Access to thousands of flights and accommodations across Europe, from budget-friendly 
                  options to luxury experiences.
                </p>
              </div>

              <div className='p-6 border border-gray-200 rounded-lg hover:shadow-card-hover transition'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Best Prices</h3>
                <p className='text-gray-600'>
                  We compare prices from multiple providers to ensure you get the best deals available. 
                  Our price guarantee means you'll always get great value.
                </p>
              </div>

              <div className='p-6 border border-gray-200 rounded-lg hover:shadow-card-hover transition'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Easy Booking</h3>
                <p className='text-gray-600'>
                  Our intuitive platform makes it easy to search, compare, and book your perfect trip 
                  in just a few clicks.
                </p>
              </div>

              <div className='p-6 border border-gray-200 rounded-lg hover:shadow-card-hover transition'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Multi-Language Support</h3>
                <p className='text-gray-600'>
                  Available in 14 European languages, making it easy for travelers from across the continent 
                  to use our platform.
                </p>
              </div>

              <div className='p-6 border border-gray-200 rounded-lg hover:shadow-card-hover transition'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Multi-Currency</h3>
                <p className='text-gray-600'>
                  View prices in your preferred currency with real-time exchange rates for 11 EMEA currencies.
                </p>
              </div>

              <div className='p-6 border border-gray-200 rounded-lg hover:shadow-card-hover transition'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>24/7 Support</h3>
                <p className='text-gray-600'>
                  Our customer support team is available around the clock to assist you with any questions 
                  or issues you may have.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-primary-50'>
        <div className='container-responsive'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Ready to Start Your Journey?</h2>
            <p className='text-lg text-gray-600 mb-8'>
              Join thousands of travelers who trust HappyTrip for their European adventures.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a
                href='/flights'
                className='px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition'
              >
                Search Flights
              </a>
              <a
                href='/accommodations'
                className='px-6 py-3 bg-white text-primary-500 border-2 border-primary-500 rounded-lg font-medium hover:bg-primary-50 transition'
              >
                Find Accommodations
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className='py-16 bg-white'>
        <div className='container-responsive'>
          <div className='max-w-2xl mx-auto text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Get in Touch</h2>
            <p className='text-gray-600 mb-8'>
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className='space-y-4'>
              <div>
                <p className='text-gray-700 font-medium'>Email</p>
                <a href='mailto:support@happytrip.com' className='text-primary-500 hover:text-primary-600'>
                  support@happytrip.com
                </a>
              </div>
              <div>
                <p className='text-gray-700 font-medium'>Phone</p>
                <a href='tel:+1234567890' className='text-primary-500 hover:text-primary-600'>
                  +1 (234) 567-890
                </a>
              </div>
              <div>
                <p className='text-gray-700 font-medium'>Address</p>
                <p className='text-gray-600'>123 Travel Street, Berlin, Germany</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
