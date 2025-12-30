import React from 'react';
import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-300 border-t border-gray-800'>
      <div className='container-responsive py-16'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-12'>
          {/* Company Info */}
          <div>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20'>
                <span className='text-white font-bold text-sm'>HT</span>
              </div>
              <span className='text-xl font-bold text-white'>HappyTrip</span>
            </div>
            <p className='text-sm text-gray-400 leading-relaxed'>
              Your trusted travel companion for flights and accommodations across Europe.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-white font-bold mb-6 text-lg'>Quick Links</h3>
            <ul className='space-y-3 text-sm'>
              <li>
                <Link href='/flights' className='text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block'>
                  Flights
                </Link>
              </li>
              <li>
                <Link href='/accommodations' className='text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block'>
                  Accommodations
                </Link>
              </li>
              <li>
                <Link href='/about' className='text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='/blog' className='text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block'>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className='text-white font-bold mb-6 text-lg'>Support</h3>
            <ul className='space-y-3 text-sm'>
              <li>
                <Link href='/help' className='text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block'>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href='/contact' className='text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block'>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href='/privacy' className='text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='/terms' className='text-gray-400 hover:text-primary-400 transition-colors duration-200 inline-block'>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Contact</h3>
            <ul className='space-y-3 text-sm'>
              <li className='flex items-center gap-2'>
                <FiMail className='w-4 h-4' />
                <a href='mailto:support@happytrip.com' className='hover:text-primary-400 transition'>
                  support@happytrip.com
                </a>
              </li>
              <li className='flex items-center gap-2'>
                <FiPhone className='w-4 h-4' />
                <a href='tel:+1234567890' className='hover:text-primary-400 transition'>
                  +1 (234) 567-890
                </a>
              </li>
              <li className='flex items-start gap-2'>
                <FiMapPin className='w-4 h-4 mt-0.5' />
                <span>123 Travel Street, Berlin, Germany</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className='border-gray-800 my-8' />

        {/* Bottom */}
        <div className='flex flex-col md:flex-row items-center justify-between text-sm'>
          <p className='text-gray-400'>&copy; {currentYear} HappyTrip. All rights reserved.</p>
          <div className='flex gap-6 mt-4 md:mt-0'>
            <a href='#' className='text-gray-400 hover:text-primary-400 transition-colors duration-200'>
              Facebook
            </a>
            <a href='#' className='text-gray-400 hover:text-primary-400 transition-colors duration-200'>
              Twitter
            </a>
            <a href='#' className='text-gray-400 hover:text-primary-400 transition-colors duration-200'>
              Instagram
            </a>
            <a href='#' className='text-gray-400 hover:text-primary-400 transition-colors duration-200'>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
