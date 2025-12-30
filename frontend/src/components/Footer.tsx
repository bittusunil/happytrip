import React from 'react';
import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-900 text-gray-300'>
      <div className='container-responsive py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          {/* Company Info */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>HT</span>
              </div>
              <span className='text-lg font-bold text-white'>HappyTrip</span>
            </div>
            <p className='text-sm text-gray-400'>
              Your trusted travel companion for flights and accommodations across Europe.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/flights' className='hover:text-primary-400 transition'>
                  Flights
                </Link>
              </li>
              <li>
                <Link href='/accommodations' className='hover:text-primary-400 transition'>
                  Accommodations
                </Link>
              </li>
              <li>
                <Link href='/about' className='hover:text-primary-400 transition'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='/blog' className='hover:text-primary-400 transition'>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Support</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/help' className='hover:text-primary-400 transition'>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-primary-400 transition'>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href='/privacy' className='hover:text-primary-400 transition'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='/terms' className='hover:text-primary-400 transition'>
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
        <div className='flex flex-col md:flex-row items-center justify-between text-sm text-gray-400'>
          <p>&copy; {currentYear} HappyTrip. All rights reserved.</p>
          <div className='flex gap-6 mt-4 md:mt-0'>
            <a href='#' className='hover:text-primary-400 transition'>
              Facebook
            </a>
            <a href='#' className='hover:text-primary-400 transition'>
              Twitter
            </a>
            <a href='#' className='hover:text-primary-400 transition'>
              Instagram
            </a>
            <a href='#' className='hover:text-primary-400 transition'>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
