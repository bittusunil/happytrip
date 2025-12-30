'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout, Card, Button } from '@/components';
import { Accommodation } from '@/types';
import { mockAccommodations } from '@/data/mockAccommodations';
import {
  FiCheckCircle,
  FiCalendar,
  FiUsers,
  FiMapPin,
  FiDollarSign,
  FiMail,
  FiDownload,
  FiHome,
} from 'react-icons/fi';

interface Booking {
  id: string;
  referenceId: string;
  type: string;
  status: string;
  totalPrice: number;
  currency: string;
  checkInDate: string;
  checkOutDate: string;
  bookingDetails: {
    guests: number;
    rooms: number;
    guestDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
  };
  notes?: string;
  createdAt: string;
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  const loadBooking = () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage (guest bookings)
      const guestBookings = JSON.parse(localStorage.getItem('guestBookings') || '[]');
      const foundBooking = guestBookings.find(
        (b: Booking) =>
          b.id === bookingId ||
          (b as any).bookingReference === bookingId ||
          b.referenceId === bookingId
      );

      if (foundBooking) {
        setBooking(foundBooking);
        // Find accommodation - check bookingDetails for accommodationId, then referenceId
        const accId =
          (foundBooking.bookingDetails as any)?.accommodationId ||
          foundBooking.referenceId;
        const acc = mockAccommodations.find((a) => a._id === accId);
        if (acc) {
          setAccommodation(acc);
        }
      } else {
        // Try to load from API if user is authenticated
        // For now, show error
        console.error('Booking not found');
      }
    } catch (error) {
      console.error('Error loading booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!booking) return;

    const content = `
BOOKING CONFIRMATION
====================

Booking Reference: ${booking.referenceId}
Status: ${booking.status.toUpperCase()}

ACCOMMODATION DETAILS
---------------------
${accommodation?.name || 'N/A'}
${accommodation?.location.address || ''}
${accommodation?.location.city || ''}, ${accommodation?.location.country || ''}

GUEST INFORMATION
-----------------
Name: ${booking.bookingDetails?.guestDetails?.firstName || ''} ${booking.bookingDetails?.guestDetails?.lastName || ''}
Email: ${booking.bookingDetails?.guestDetails?.email || ''}
Phone: ${booking.bookingDetails?.guestDetails?.phone || ''}

BOOKING DETAILS
---------------
Check-in: ${booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}
Check-out: ${booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}
Guests: ${booking.bookingDetails?.guests || 0}
Rooms: ${booking.bookingDetails?.rooms || 0}

PAYMENT
-------
Total: ${booking.totalPrice.toFixed(2)} ${booking.currency}
Payment Status: Confirmed

Booked on: ${new Date(booking.createdAt).toLocaleDateString()}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${booking.referenceId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className='container-responsive py-12'>
          <div className='text-center py-20'>
            <p className='text-gray-600'>Loading booking confirmation...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!booking) {
    return (
      <Layout>
        <div className='container-responsive py-12'>
          <Card className='text-center py-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Booking not found</h2>
            <p className='text-gray-600 mb-6'>
              The booking you're looking for doesn't exist or has been removed.
            </p>
            <Link href='/accommodations'>
              <Button>Back to Accommodations</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  const nights = booking.checkInDate && booking.checkOutDate
    ? Math.ceil(
        (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <Layout>
      <div className='container-responsive py-12'>
        {/* Success Header */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4'>
            <FiCheckCircle className='w-12 h-12 text-green-600' />
          </div>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>Booking Confirmed!</h1>
          <p className='text-lg text-gray-600'>
            Your accommodation booking has been successfully confirmed
          </p>
          <p className='text-sm text-gray-500 mt-2'>
            Booking Reference: <span className='font-semibold text-gray-900'>{booking.id || (booking as any).bookingReference || booking.referenceId}</span>
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Booking Details Card */}
            <Card>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>Booking Details</h2>
                <div className='flex gap-2'>
                  <Button variant='outline' size='sm' onClick={handlePrint}>
                    <FiDownload className='w-4 h-4 mr-2' />
                    Print
                  </Button>
                  <Button variant='outline' size='sm' onClick={handleDownload}>
                    <FiDownload className='w-4 h-4 mr-2' />
                    Download
                  </Button>
                </div>
              </div>

              {/* Accommodation Info */}
              {accommodation && (
                <div className='mb-6 pb-6 border-b border-gray-200'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                    {accommodation.name}
                  </h3>
                  <div className='flex items-start gap-2 text-gray-600 mb-2'>
                    <FiMapPin className='w-5 h-5 text-gray-400 mt-0.5' />
                    <div>
                      <p>{accommodation.location.address}</p>
                      <p>
                        {accommodation.location.city}, {accommodation.location.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Guest Information */}
              <div className='mb-6 pb-6 border-b border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Guest Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-600 mb-1'>Name</p>
                    <p className='font-medium text-gray-900'>
                      {booking.bookingDetails?.guestDetails?.firstName || ''}{' '}
                      {booking.bookingDetails?.guestDetails?.lastName || ''}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 mb-1'>Email</p>
                    <p className='font-medium text-gray-900'>
                      {booking.bookingDetails?.guestDetails?.email || ''}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 mb-1'>Phone</p>
                    <p className='font-medium text-gray-900'>
                      {booking.bookingDetails?.guestDetails?.phone || ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <div className='flex items-start gap-3'>
                  <FiCalendar className='w-5 h-5 text-primary-600 mt-1' />
                  <div>
                    <p className='text-sm text-gray-600 mb-1'>Check-in</p>
                    <p className='font-semibold text-gray-900'>
                      {booking.checkInDate
                        ? new Date(booking.checkInDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                    {accommodation && (
                      <p className='text-xs text-gray-500 mt-1'>
                        Check-in time: {accommodation.policies.checkInTime}
                      </p>
                    )}
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <FiCalendar className='w-5 h-5 text-primary-600 mt-1' />
                  <div>
                    <p className='text-sm text-gray-600 mb-1'>Check-out</p>
                    <p className='font-semibold text-gray-900'>
                      {booking.checkOutDate
                        ? new Date(booking.checkOutDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                    {accommodation && (
                      <p className='text-xs text-gray-500 mt-1'>
                        Check-out time: {accommodation.policies.checkOutTime}
                      </p>
                    )}
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <FiUsers className='w-5 h-5 text-primary-600 mt-1' />
                  <div>
                    <p className='text-sm text-gray-600 mb-1'>Guests & Rooms</p>
                    <p className='font-semibold text-gray-900'>
                      {booking.bookingDetails?.guests || 0} {booking.bookingDetails?.guests === 1 ? 'Guest' : 'Guests'} • {booking.bookingDetails?.rooms || 0}{' '}
                      {booking.bookingDetails?.rooms === 1 ? 'Room' : 'Rooms'}
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <FiHome className='w-5 h-5 text-primary-600 mt-1' />
                  <div>
                    <p className='text-sm text-gray-600 mb-1'>Duration</p>
                    <p className='font-semibold text-gray-900'>
                      {nights} {nights === 1 ? 'Night' : 'Nights'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {booking.notes && (
                <div className='mb-6 pb-6 border-b border-gray-200'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>Special Requests</h3>
                  <p className='text-gray-700'>{booking.notes}</p>
                </div>
              )}

              {/* Payment Summary */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Payment Summary</h3>
                <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>
                      {nights} {nights === 1 ? 'night' : 'nights'} × {booking.bookingDetails?.rooms || 0}{' '}
                      {booking.bookingDetails?.rooms === 1 ? 'room' : 'rooms'}
                    </span>
                    <span className='text-gray-900'>
                      {(booking.totalPrice / (booking.bookingDetails?.rooms || 1) / nights) *
                        (booking.bookingDetails?.rooms || 1) *
                        nights}{' '}
                      {booking.currency}
                    </span>
                  </div>
                  <div className='flex justify-between pt-2 border-t border-gray-200'>
                    <span className='font-semibold text-gray-900'>Total Paid</span>
                    <span className='text-xl font-bold text-primary-600'>
                      {booking.totalPrice.toFixed(2)} {booking.currency}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 mt-2'>
                    <FiCheckCircle className='w-4 h-4 text-green-600' />
                    <span className='text-sm text-green-600 font-medium'>Payment Confirmed</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Next Steps */}
            <Card>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>What's Next?</h2>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <div className='w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-primary-600 text-sm font-semibold'>1</span>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900 mb-1'>Confirmation Email</p>
                    <p className='text-sm text-gray-600'>
                      A confirmation email has been sent to{' '}
                      <span className='font-medium'>{booking.bookingDetails?.guestDetails?.email}</span>
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-primary-600 text-sm font-semibold'>2</span>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900 mb-1'>Prepare for Your Stay</p>
                    <p className='text-sm text-gray-600'>
                      Make sure to bring a valid ID and arrive at the check-in time specified above.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-primary-600 text-sm font-semibold'>3</span>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900 mb-1'>Contact Support</p>
                    <p className='text-sm text-gray-600'>
                      If you have any questions or need to modify your booking, please contact our support team.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-20 space-y-6'>
              {/* Quick Actions */}
              <Card>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Quick Actions</h3>
                <div className='space-y-3'>
                  <Button fullWidth variant='outline' onClick={handlePrint}>
                    <FiDownload className='w-4 h-4 mr-2' />
                    Print Confirmation
                  </Button>
                  <Button fullWidth variant='outline' onClick={handleDownload}>
                    <FiDownload className='w-4 h-4 mr-2' />
                    Download PDF
                  </Button>
                  <Link href='/accommodations'>
                    <Button fullWidth variant='outline'>
                      <FiHome className='w-4 h-4 mr-2' />
                      Book Another Stay
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Need Help */}
              <Card>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Need Help?</h3>
                <p className='text-sm text-gray-600 mb-4'>
                  If you have any questions about your booking, our support team is here to help.
                </p>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center gap-2'>
                    <FiMail className='w-4 h-4 text-gray-400' />
                    <span className='text-gray-700'>support@happytrip.com</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-700'>Reference: {booking.referenceId}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
