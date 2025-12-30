'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Layout, Card, Button } from '@/components';
import { Accommodation, Review } from '@/types';
import { apiService } from '@/services/api';
import { mockAccommodations } from '@/data/mockAccommodations';
import { mockReviews } from '@/data/mockReviews';
import {
  FiStar,
  FiMapPin,
  FiWifi,
  FiCoffee,
  FiDroplet,
  FiHome,
  FiShield,
  FiClock,
  FiCalendar,
  FiUsers,
  FiArrowLeft,
  FiCheck,
} from 'react-icons/fi';

export default function AccommodationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
  });

  useEffect(() => {
    if (id) {
      fetchAccommodation();
      fetchReviews();
    }
  }, [id]);

  const fetchAccommodation = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from API first, fallback to mock data
      try {
        const response = await apiService.getAccommodationById(id);
        if (response.data) {
          setAccommodation(response.data);
        } else {
          // Fallback to mock data
          const mockAccommodation = mockAccommodations.find((a) => a._id === id);
          if (mockAccommodation) {
            setAccommodation(mockAccommodation);
          }
        }
      } catch (error) {
        // Fallback to mock data
        const mockAccommodation = mockAccommodations.find((a) => a._id === id);
        if (mockAccommodation) {
          setAccommodation(mockAccommodation);
        } else {
          toast.error('Accommodation not found');
          router.push('/accommodations');
        }
      }
    } catch (error) {
      console.error('Error fetching accommodation:', error);
      toast.error('Failed to load accommodation details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      try {
        const response = await apiService.getAccommodationReviews(id);
        if (response.data && response.data.length > 0) {
          setReviews(response.data);
        } else {
          // Fallback to mock reviews
          setReviews(mockReviews[id] || []);
        }
      } catch (error) {
        // Fallback to mock reviews
        setReviews(mockReviews[id] || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews(mockReviews[id] || []);
    }
  };

  const handleBookNow = () => {
    if (!accommodation) return;

    if (!bookingDates.checkIn || !bookingDates.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (new Date(bookingDates.checkOut) <= new Date(bookingDates.checkIn)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    // Calculate total price
    const checkIn = new Date(bookingDates.checkIn);
    const checkOut = new Date(bookingDates.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = accommodation.pricing.basePrice * nights * bookingDates.rooms;

    // Navigate to booking form with pre-filled data
    router.push(
      `/bookings/new?referenceId=${accommodation._id}&checkIn=${bookingDates.checkIn}&checkOut=${bookingDates.checkOut}&guests=${bookingDates.guests}&rooms=${bookingDates.rooms}&totalPrice=${totalPrice}&currency=${accommodation.pricing.currency}`
    );
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      hotel: '🏨',
      apartment: '🏠',
      villa: '🏡',
      cottage: '🏘️',
      resort: '🏖️',
      hostel: '🛏️',
    };
    return icons[type] || '🏨';
  };

  const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <FiWifi className='w-5 h-5' />,
    coffee: <FiCoffee className='w-5 h-5' />,
    pool: <FiDroplet className='w-5 h-5' />,
    parking: <FiShield className='w-5 h-5' />,
    kitchen: <FiHome className='w-5 h-5' />,
  };

  if (isLoading) {
    return (
      <Layout>
        <div className='container-responsive py-12'>
          <div className='text-center py-20'>
            <p className='text-gray-600'>Loading accommodation details...</p>
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

  const images = accommodation.images.length > 0 ? accommodation.images : [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
  ];

  return (
    <Layout>
      <div className='container-responsive py-8'>
        {/* Back Button */}
        <Link
          href='/accommodations'
          className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
        >
          <FiArrowLeft className='w-4 h-4' />
          Back to Accommodations
        </Link>

        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-start justify-between mb-4'>
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <span className='text-2xl'>{getTypeIcon(accommodation.type)}</span>
                <span className='text-sm text-gray-600 capitalize'>{accommodation.type}</span>
              </div>
              <h1 className='text-4xl font-bold text-gray-900 mb-2'>{accommodation.name}</h1>
              <div className='flex items-center gap-4 text-gray-600'>
                <div className='flex items-center gap-1'>
                  <FiMapPin className='w-4 h-4' />
                  <span>
                    {accommodation.location.city}, {accommodation.location.country}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <FiStar className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                  <span className='font-semibold text-gray-900'>
                    {accommodation.rating.average.toFixed(1)}
                  </span>
                  <span className='text-sm'>({accommodation.rating.count} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className='mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            {/* Main Image */}
            <div className='md:col-span-3 relative h-96 bg-gray-200 rounded-lg overflow-hidden'>
              <img
                src={images[selectedImageIndex]}
                alt={accommodation.name}
                className='w-full h-full object-cover'
              />
            </div>

            {/* Thumbnail Images */}
            <div className='grid grid-cols-1 gap-4'>
              {images.slice(0, 3).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-28 bg-gray-200 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${accommodation.name} ${index + 1}`} className='w-full h-full object-cover' />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Description */}
            <Card>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>About this place</h2>
              <p className='text-gray-700 leading-relaxed'>{accommodation.description}</p>
            </Card>

            {/* Amenities */}
            <Card>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Amenities</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {accommodation.amenities.map((amenity, index) => {
                  const amenityKey = amenity.toLowerCase().replace(/\s+/g, '');
                  const icon = amenityIcons[amenityKey] || <FiCheck className='w-5 h-5' />;
                  return (
                    <div key={index} className='flex items-center gap-3'>
                      <div className='text-primary-600'>{icon}</div>
                      <span className='text-gray-700'>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Room Types */}
            <Card>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Room Types & Pricing</h2>
              <div className='space-y-4'>
                {accommodation.rooms.types.map((roomType, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'
                  >
                    <div>
                      <h3 className='font-semibold text-gray-900'>{roomType.type}</h3>
                      <p className='text-sm text-gray-600'>{roomType.count} rooms available</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-xl font-bold text-primary-600'>
                        {roomType.basePrice.toFixed(2)} {accommodation.pricing.currency}
                      </p>
                      <p className='text-xs text-gray-600'>per night</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Policies */}
            <Card>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Policies</h2>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <FiClock className='w-5 h-5 text-primary-600 mt-1' />
                  <div>
                    <p className='font-semibold text-gray-900'>Check-in / Check-out</p>
                    <p className='text-gray-600'>
                      Check-in: {accommodation.policies.checkInTime} | Check-out:{' '}
                      {accommodation.policies.checkOutTime}
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <FiShield className='w-5 h-5 text-primary-600 mt-1' />
                  <div>
                    <p className='font-semibold text-gray-900'>Cancellation</p>
                    <p className='text-gray-600'>{accommodation.policies.cancellation}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <FiCalendar className='w-5 h-5 text-primary-600 mt-1' />
                  <div>
                    <p className='font-semibold text-gray-900'>Minimum Stay</p>
                    <p className='text-gray-600'>
                      {accommodation.policies.minStay} night{accommodation.policies.minStay !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews */}
            {reviews.length > 0 && (
              <Card>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  Reviews ({reviews.length})
                </h2>
                <div className='space-y-6'>
                  {reviews.map((review) => (
                    <div key={review._id} className='border-b border-gray-200 pb-6 last:border-0'>
                      <div className='flex items-start justify-between mb-2'>
                        <div>
                          <div className='flex items-center gap-2 mb-1'>
                            <div className='flex items-center gap-1'>
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            {review.verified && (
                              <span className='text-xs text-green-600 flex items-center gap-1'>
                                <FiCheck className='w-3 h-3' />
                                Verified
                              </span>
                            )}
                          </div>
                          <h3 className='font-semibold text-gray-900'>{review.title}</h3>
                        </div>
                        <span className='text-sm text-gray-500'>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className='text-gray-700 mb-2'>{review.comment}</p>
                      {review.helpful > 0 && (
                        <p className='text-sm text-gray-500'>
                          {review.helpful} people found this helpful
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Location Map */}
            <Card>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>Location</h2>
              <p className='text-gray-600 mb-4'>
                {accommodation.location.address}, {accommodation.location.city},{' '}
                {accommodation.location.country}
              </p>
              <div className='relative h-64 bg-gray-200 rounded-lg overflow-hidden'>
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                  <iframe
                    width='100%'
                    height='100%'
                    frameBorder='0'
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${accommodation.location.latitude},${accommodation.location.longitude}`}
                    allowFullScreen
                  />
                ) : (
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${accommodation.location.latitude}&mlon=${accommodation.location.longitude}&zoom=15`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors'
                  >
                    <div className='text-center'>
                      <FiMapPin className='w-12 h-12 text-primary-600 mx-auto mb-2' />
                      <p className='text-gray-700 font-medium'>View on Map</p>
                      <p className='text-sm text-gray-500'>
                        {accommodation.location.latitude.toFixed(4)}, {accommodation.location.longitude.toFixed(4)}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-20'>
              <Card>
                <div className='mb-6'>
                  <div className='flex items-baseline gap-2 mb-4'>
                    <span className='text-3xl font-bold text-gray-900'>
                      {accommodation.pricing.basePrice.toFixed(2)}
                    </span>
                    <span className='text-gray-600'>
                      {accommodation.pricing.currency} / night
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600 mb-6'>
                    <FiStar className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                    <span className='font-semibold text-gray-900'>
                      {accommodation.rating.average.toFixed(1)}
                    </span>
                    <span>({accommodation.rating.count} reviews)</span>
                  </div>
                </div>

                {/* Booking Form */}
                <div className='space-y-4 mb-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Check-in
                    </label>
                    <input
                      type='date'
                      value={bookingDates.checkIn}
                      onChange={(e) =>
                        setBookingDates({ ...bookingDates, checkIn: e.target.value })
                      }
                      min={new Date().toISOString().split('T')[0]}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Check-out
                    </label>
                    <input
                      type='date'
                      value={bookingDates.checkOut}
                      onChange={(e) =>
                        setBookingDates({ ...bookingDates, checkOut: e.target.value })
                      }
                      min={
                        bookingDates.checkIn
                          ? new Date(new Date(bookingDates.checkIn).getTime() + 86400000)
                              .toISOString()
                              .split('T')[0]
                          : new Date().toISOString().split('T')[0]
                      }
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        <FiUsers className='w-4 h-4 inline mr-1' />
                        Guests
                      </label>
                      <select
                        value={bookingDates.guests}
                        onChange={(e) =>
                          setBookingDates({ ...bookingDates, guests: parseInt(e.target.value) })
                        }
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Rooms</label>
                      <select
                        value={bookingDates.rooms}
                        onChange={(e) =>
                          setBookingDates({ ...bookingDates, rooms: parseInt(e.target.value) })
                        }
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
                      >
                        {[1, 2, 3, 4].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Room' : 'Rooms'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                {bookingDates.checkIn && bookingDates.checkOut && (
                  <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-gray-600'>
                        {Math.ceil(
                          (new Date(bookingDates.checkOut).getTime() -
                            new Date(bookingDates.checkIn).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        nights × {accommodation.pricing.basePrice.toFixed(2)} {accommodation.pricing.currency}
                      </span>
                      <span className='font-semibold'>
                        {(
                          accommodation.pricing.basePrice *
                          Math.ceil(
                            (new Date(bookingDates.checkOut).getTime() -
                              new Date(bookingDates.checkIn).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) *
                          bookingDates.rooms
                        ).toFixed(2)}{' '}
                        {accommodation.pricing.currency}
                      </span>
                    </div>
                    <div className='flex items-center justify-between pt-2 border-t border-gray-200'>
                      <span className='font-semibold text-gray-900'>Total</span>
                      <span className='text-xl font-bold text-primary-600'>
                        {(
                          accommodation.pricing.basePrice *
                          Math.ceil(
                            (new Date(bookingDates.checkOut).getTime() -
                              new Date(bookingDates.checkIn).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) *
                          bookingDates.rooms
                        ).toFixed(2)}{' '}
                        {accommodation.pricing.currency}
                      </span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button fullWidth onClick={handleBookNow} size='lg'>
                  Book Now
                </Button>

                <p className='text-xs text-gray-500 text-center mt-4'>
                  You won't be charged yet
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
