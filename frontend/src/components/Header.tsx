'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Button from './Button';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome } from 'react-icons/fi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm'>
      <div className='container-responsive flex items-center justify-between h-16 md:h-20'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-3 group'>
          <div className='w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300'>
            <span className='text-white font-bold text-sm'>HT</span>
          </div>
          <span className='text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>HappyTrip</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-1'>
          <Link href='/flights' className='px-4 py-2 text-gray-700 hover:text-primary-600 font-medium rounded-lg hover:bg-gray-100/50 transition-colors duration-200'>
            Flights
          </Link>
          <Link href='/accommodations' className='px-4 py-2 text-gray-700 hover:text-primary-600 font-medium rounded-lg hover:bg-gray-100/50 transition-colors duration-200'>
            Accommodations
          </Link>
          <Link href='/about' className='px-4 py-2 text-gray-700 hover:text-primary-600 font-medium rounded-lg hover:bg-gray-100/50 transition-colors duration-200'>
            About
          </Link>
        </nav>

        {/* Right Side */}
        <div className='hidden md:flex items-center gap-3'>
          {isAuthenticated && user ? (
            <div className='flex items-center gap-3'>
              <Link href='/bookings' className='px-4 py-2 text-gray-700 hover:text-primary-600 font-medium rounded-lg hover:bg-gray-100/50 transition-colors duration-200'>
                My Bookings
              </Link>
              <div className='relative group'>
                <button className='flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200 border border-gray-200/50 hover:border-gray-300'>
                  <div className='w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center'>
                    <FiUser className='w-4 h-4 text-white' />
                  </div>
                  <span className='text-sm font-medium text-gray-700'>{user.firstName}</span>
                </button>
                <div className='absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden'>
                  <Link
                    href='/account'
                    className='block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150'
                  >
                    My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150'
                  >
                    <FiLogOut className='w-4 h-4' />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <Link href='/login'>
                <Button variant='ghost' size='sm' className='!text-gray-700 hover:!text-gray-900'>
                  Login
                </Button>
              </Link>
              <Link href='/register'>
                <Button size='sm' className='shadow-md hover:shadow-lg transition-shadow duration-200 !text-white'>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='md:hidden p-2 hover:bg-gray-100 rounded-lg transition'
        >
          {isMenuOpen ? <FiX className='w-6 h-6' /> : <FiMenu className='w-6 h-6' />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden border-t border-gray-200 bg-white'>
          <nav className='container-responsive py-4 flex flex-col gap-4'>
            <Link href='/flights' className='text-gray-700 hover:text-primary-500 transition'>
              Flights
            </Link>
            <Link href='/accommodations' className='text-gray-700 hover:text-primary-500 transition'>
              Accommodations
            </Link>
            <Link href='/about' className='text-gray-700 hover:text-primary-500 transition'>
              About
            </Link>

            {isAuthenticated && user ? (
              <>
                <hr className='my-2' />
                <Link href='/bookings' className='text-gray-700 hover:text-primary-500 transition'>
                  My Bookings
                </Link>
                <Link href='/account' className='text-gray-700 hover:text-primary-500 transition'>
                  My Account
                </Link>
                <Button
                  variant='outline'
                  fullWidth
                  onClick={handleLogout}
                  className='justify-center'
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <hr className='my-2' />
                <Link href='/login' className='w-full'>
                  <Button variant='outline' fullWidth>
                    Login
                  </Button>
                </Link>
                <Link href='/register' className='w-full'>
                  <Button fullWidth>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
