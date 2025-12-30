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
    <header className='sticky top-0 z-50 bg-white border-b border-gray-200'>
      <div className='container-responsive flex items-center justify-between h-16'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold'>HT</span>
          </div>
          <span className='text-xl font-bold text-gray-900'>HappyTrip</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-8'>
          <Link href='/flights' className='text-gray-700 hover:text-primary-500 transition'>
            Flights
          </Link>
          <Link href='/accommodations' className='text-gray-700 hover:text-primary-500 transition'>
            Accommodations
          </Link>
          <Link href='/about' className='text-gray-700 hover:text-primary-500 transition'>
            About
          </Link>
        </nav>

        {/* Right Side */}
        <div className='hidden md:flex items-center gap-4'>
          {isAuthenticated && user ? (
            <div className='flex items-center gap-4'>
              <Link href='/bookings' className='text-gray-700 hover:text-primary-500 transition'>
                My Bookings
              </Link>
              <div className='relative group'>
                <button className='flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition'>
                  <FiUser className='w-5 h-5' />
                  <span className='text-sm'>{user.firstName}</span>
                </button>
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition'>
                  <Link
                    href='/profile'
                    className='block px-4 py-2 text-gray-700 hover:bg-gray-100 first:rounded-t-lg'
                  >
                    Profile
                  </Link>
                  <Link
                    href='/settings'
                    className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 last:rounded-b-lg flex items-center gap-2'
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
                <Button variant='outline' size='sm'>
                  Login
                </Button>
              </Link>
              <Link href='/register'>
                <Button size='sm'>Sign Up</Button>
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
                <Link href='/profile' className='text-gray-700 hover:text-primary-500 transition'>
                  Profile
                </Link>
                <Link href='/settings' className='text-gray-700 hover:text-primary-500 transition'>
                  Settings
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
