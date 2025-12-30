'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Layout, Card, Button, Input } from '@/components';
import { Accommodation } from '@/types';
import { apiService } from '@/services/api';
import { mockAccommodations } from '@/data/mockAccommodations';
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUsers,
  FiHome,
  FiCreditCard,
  FiLock,
} from 'react-icons/fi';

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get booking params from URL
  const accommodationId = searchParams.get('referenceId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = parseInt(searchParams.get('guests') || '1');
  const rooms = parseInt(searchParams.get('rooms') || '1');
  const totalPrice = parseFloat(searchParams.get('totalPrice') || '0');
  const currency = searchParams.get('currency') || 'EUR';

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
  });
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    if (!accommodationId || !checkIn || !checkOut) {
      toast.error('Missing booking information');
      router.push('/accommodations');
      return;
    }

    fetchAccommodation();
  }, [accommodationId]);

  const fetchAccommodation = async () => {
    setIsLoading(true);
    try {
      if (accommodationId) {
        try {
          const response = await apiService.getAccommodationById(accommodationId);
          if (response.data) {
            setAccommodation(response.data);
          } else {
            const mockAccommodation = mockAccommodations.find((a) => a._id === accommodationId);
            if (mockAccommodation) setAccommodation(mockAccommodation);
          }
        } catch (error) {
          const mockAccommodation = mockAccommodations.find((a) => a._id === accommodationId);
          if (mockAccommodation) setAccommodation(mockAccommodation);
        }
      }
    } catch (error) {
      console.error('Error fetching accommodation:', error);
      toast.error('Failed to load accommodation details');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
      toast.error('Please fill in all required guest details');
      return;
    }

    if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.cardholderName) {
      toast.error('Please fill in all payment details');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate booking reference
      const bookingReference = `HT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create booking data
      const bookingData = {
        type: 'accommodation',
        referenceId: accommodationId,
        totalPrice,
        currency,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        bookingDetails: {
          guests,
          rooms,
          guestDetails,
          paymentDetails: {
            // Don't store full card details in real app - just last 4 digits
            cardLast4: paymentDetails.cardNumber.slice(-4),
            cardholderName: paymentDetails.cardholderName,
          },
          specialRequests,
        },
        notes: specialRequests,
      };

      // Store booking locally (in a real app, this would go to the backend)
      const booking = {
        id: bookingReference,
        referenceId: accommodationId, // Store accommodation ID for lookup
        bookingReference: bookingReference, // Store booking reference separately
        type: 'accommodation',
        status: 'confirmed',
        totalPrice,
        currency,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        bookingDetails: {
          ...bookingData.bookingDetails,
          accommodationId: accommodationId, // Also store in booking details
        },
        notes: specialRequests,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store in localStorage for demo purposes
      const existingBookings = JSON.parse(localStorage.getItem('guestBookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('guestBookings', JSON.stringify(existingBookings));

      // Try to create booking via API if user is authenticated
      try {
        const { useAuthStore } = await import('@/store/authStore');
        const authStore = useAuthStore.getState();
        if (authStore.isAuthenticated && accommodationId) {
          await apiService.createBooking({
            type: 'accommodation',
            referenceId: accommodationId,
            totalPrice,
            currency,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            bookingDetails: bookingData.bookingDetails,
            notes: specialRequests,
          });
        }
      } catch (error) {
        // Continue with local storage booking if API fails
        console.log('Booking stored locally');
      }

      toast.success('Booking confirmed!');
      router.push(`/bookings/confirmation/${bookingReference}`);
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className='container-responsive py-12'>
          <div className='text-center py-20'>
            <p className='text-gray-600'>Loading booking form...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!accommodation) {
    return (
      <Layout>
        <div className='container-responsive py-12'>
          <Card className='text-center py-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Accommodation not found</h2>
            <Link href='/accommodations'>
              <Button>Back to Accommodations</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  const nights = calculateNights();

  return (
    <Layout>
      <div className='container-responsive py-8'>
        {/* Back Button */}
        <Link
          href={`/accommodations/${accommodationId}`}
          className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
        >
          <FiArrowLeft className='w-4 h-4' />
          Back to Accommodation Details
        </Link>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Booking Form */}
          <div className='lg:col-span-2'>
            <Card>
              <h1 className='text-3xl font-bold text-gray-900 mb-8'>Complete Your Booking</h1>

              <form onSubmit={handleSubmit} className='space-y-8'>
                {/* Guest Information */}
                <div>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                    <FiUser className='w-5 h-5' />
                    Guest Information
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input
                      label='First Name *'
                      value={guestDetails.firstName}
                      onChange={(e) =>
                        setGuestDetails({ ...guestDetails, firstName: e.target.value })
                      }
                      required
                    />
                    <Input
                      label='Last Name *'
                      value={guestDetails.lastName}
                      onChange={(e) =>
                        setGuestDetails({ ...guestDetails, lastName: e.target.value })
                      }
                      required
                    />
                    <Input
                      label='Email *'
                      type='email'
                      icon={<FiMail className='w-5 h-5' />}
                      value={guestDetails.email}
                      onChange={(e) =>
                        setGuestDetails({ ...guestDetails, email: e.target.value })
                      }
                      required
                    />
                    <Input
                      label='Phone *'
                      type='tel'
                      icon={<FiPhone className='w-5 h-5' />}
                      value={guestDetails.phone}
                      onChange={(e) =>
                        setGuestDetails({ ...guestDetails, phone: e.target.value })
                      }
                      required
                    />
                    <Input
                      label='Address'
                      value={guestDetails.address}
                      onChange={(e) =>
                        setGuestDetails({ ...guestDetails, address: e.target.value })
                      }
                    />
                    <div className='grid grid-cols-2 gap-4'>
                      <Input
                        label='City'
                        value={guestDetails.city}
                        onChange={(e) =>
                          setGuestDetails({ ...guestDetails, city: e.target.value })
                        }
                      />
                      <Input
                        label='Country'
                        value={guestDetails.country}
                        onChange={(e) =>
                          setGuestDetails({ ...guestDetails, country: e.target.value })
                        }
                      />
                    </div>
                    <Input
                      label='ZIP Code'
                      value={guestDetails.zipCode}
                      onChange={(e) =>
                        setGuestDetails({ ...guestDetails, zipCode: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                    <FiCreditCard className='w-5 h-5' />
                    Payment Information
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='md:col-span-2'>
                      <Input
                        label='Cardholder Name *'
                        value={paymentDetails.cardholderName}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, cardholderName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <Input
                        label='Card Number *'
                        value={paymentDetails.cardNumber}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            cardNumber: formatCardNumber(e.target.value),
                          })
                        }
                        placeholder='1234 5678 9012 3456'
                        maxLength={19}
                        required
                      />
                    </div>
                    <Input
                      label='Expiry Date *'
                      value={paymentDetails.expiryDate}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          expiryDate: formatExpiryDate(e.target.value),
                        })
                      }
                      placeholder='MM/YY'
                      maxLength={5}
                      required
                    />
                    <Input
                      label='CVV *'
                      value={paymentDetails.cvv}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          cvv: e.target.value.replace(/\D/g, '').slice(0, 4),
                        })
                      }
                      placeholder='123'
                      maxLength={4}
                      type='password'
                      required
                    />
                  </div>
                  <div className='flex items-start gap-2 mt-4 p-3 bg-blue-50 rounded-lg'>
                    <FiLock className='w-5 h-5 text-blue-600 mt-0.5' />
                    <p className='text-sm text-blue-800'>
                      Your payment information is secure and encrypted. We do not store your full card details.
                    </p>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                    <FiHome className='w-5 h-5' />
                    Special Requests (Optional)
                  </h2>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={4}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
                    placeholder='Any special requests or notes for your stay...'
                  />
                </div>

                {/* Submit Button */}
                <div className='flex gap-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => router.back()}
                    className='flex-1'
                  >
                    Cancel
                  </Button>
                  <Button type='submit' isLoading={isSubmitting} className='flex-1'>
                    Confirm Booking
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className='lg:col-span-1'>
            <div className='sticky top-20'>
              <Card>
                <h2 className='text-xl font-bold text-gray-900 mb-6'>Booking Summary</h2>

                {/* Accommodation Info */}
                <div className='mb-6 pb-6 border-b border-gray-200'>
                  <h3 className='font-semibold text-gray-900 mb-2'>{accommodation.name}</h3>
                  <p className='text-sm text-gray-600 mb-4'>
                    {accommodation.location.city}, {accommodation.location.country}
                  </p>
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center gap-2 text-gray-700'>
                      <FiCalendar className='w-4 h-4 text-gray-400' />
                      <span>
                        Check-in: {checkIn ? new Date(checkIn).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-gray-700'>
                      <FiCalendar className='w-4 h-4 text-gray-400' />
                      <span>
                        Check-out: {checkOut ? new Date(checkOut).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-gray-700'>
                      <FiUsers className='w-4 h-4 text-gray-400' />
                      <span>
                        {guests} {guests === 1 ? 'Guest' : 'Guests'} • {rooms}{' '}
                        {rooms === 1 ? 'Room' : 'Rooms'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className='space-y-3 mb-6'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>
                      {nights} {nights === 1 ? 'night' : 'nights'} × {rooms}{' '}
                      {rooms === 1 ? 'room' : 'rooms'}
                    </span>
                    <span className='text-gray-900'>
                      {(totalPrice / rooms / nights) * rooms * nights} {currency}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Price per night</span>
                    <span className='text-gray-900'>
                      {(totalPrice / rooms / nights).toFixed(2)} {currency}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className='pt-6 border-t border-gray-200'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-lg font-semibold text-gray-900'>Total</span>
                    <span className='text-2xl font-bold text-primary-600'>
                      {totalPrice.toFixed(2)} {currency}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500'>
                    Includes all taxes and fees
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
