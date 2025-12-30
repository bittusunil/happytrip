'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Layout, Button, Card } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/services/api';
import { Booking, BookingStatus, BookingType, PaginatedResponse } from '@/types';
import { FiCalendar, FiMapPin, FiDollarSign, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'all' | BookingStatus>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchBookings();
  }, [isAuthenticated, router, page, filter]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response: PaginatedResponse<Booking> = await apiService.getBookings(page, 10);
      let filtered = response.data;

      if (filter !== 'all') {
        filtered = filtered.filter((b) => b.status === filter);
      }

      setBookings(filtered);
      setTotalPages(response.pages);
    } catch (error: any) {
      toast.error('Failed to load bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await apiService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const statusConfig = {
      [BookingStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      [BookingStatus.CONFIRMED]: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
      [BookingStatus.CANCELLED]: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      [BookingStatus.COMPLETED]: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getTypeLabel = (type: BookingType) => {
    return type === BookingType.FLIGHT ? '✈️ Flight' : '🏨 Accommodation';
  };

  return (
    <Layout>
      <div className='container-responsive py-12'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>My Bookings</h1>
          <p className='text-gray-600 mt-2'>View and manage all your travel bookings</p>
        </div>

        {/* Filters */}
        <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
          {(['all', 'pending', 'confirmed', 'cancelled', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className='text-center py-12'>
            <p className='text-gray-600'>Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <Card className='text-center py-12'>
            <FiAlertCircle className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>No bookings found</h3>
            <p className='text-gray-600 mb-6'>Start your journey by booking a flight or accommodation</p>
            <div className='flex gap-4 justify-center'>
              <Link href='/flights'>
                <Button variant='outline'>Search Flights</Button>
              </Link>
              <Link href='/accommodations'>
                <Button>Find Accommodations</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className='space-y-4'>
            {bookings.map((booking) => (
              <Card key={booking.id} hoverable>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    {/* Header */}
                    <div className='flex items-center gap-4 mb-4'>
                      <div className='text-2xl'>{booking.type === BookingType.FLIGHT ? '✈️' : '🏨'}</div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {booking.type === BookingType.FLIGHT ? 'Flight Booking' : 'Accommodation Booking'}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Reference: {booking.referenceId}
                        </p>
                      </div>
                      <div className='ml-auto'>{getStatusBadge(booking.status)}</div>
                    </div>

                    {/* Details */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                      {booking.checkInDate && (
                        <div className='flex items-center gap-2 text-gray-700'>
                          <FiCalendar className='w-4 h-4 text-gray-400' />
                          <div>
                            <p className='text-xs text-gray-600'>Check-in</p>
                            <p className='text-sm font-medium'>
                              {new Date(booking.checkInDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {booking.checkOutDate && (
                        <div className='flex items-center gap-2 text-gray-700'>
                          <FiCalendar className='w-4 h-4 text-gray-400' />
                          <div>
                            <p className='text-xs text-gray-600'>Check-out</p>
                            <p className='text-sm font-medium'>
                              {new Date(booking.checkOutDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className='flex items-center gap-2 text-gray-700'>
                        <FiDollarSign className='w-4 h-4 text-gray-400' />
                        <div>
                          <p className='text-xs text-gray-600'>Total Price</p>
                          <p className='text-sm font-medium'>
                            {booking.totalPrice.toFixed(2)} {booking.currency}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    {booking.bookingDetails && (
                      <div className='bg-gray-50 rounded p-3 mb-4 text-sm'>
                        <p className='text-gray-700'>
                          {JSON.stringify(booking.bookingDetails, null, 2)}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    {booking.notes && (
                      <div className='text-sm text-gray-600 mb-4'>
                        <p className='font-medium text-gray-700'>Notes:</p>
                        <p>{booking.notes}</p>
                      </div>
                    )}

                    {/* Dates */}
                    <p className='text-xs text-gray-500'>
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className='flex flex-col gap-2 ml-4'>
                    <Link href={`/bookings/${booking.id}`}>
                      <Button variant='outline' size='sm'>
                        View Details
                      </Button>
                    </Link>

                    {booking.status === BookingStatus.PENDING ||
                    booking.status === BookingStatus.CONFIRMED ? (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-4 mt-8'>
            <Button
              variant='outline'
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className='text-gray-600'>
              Page {page} of {totalPages}
            </span>
            <Button
              variant='outline'
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
