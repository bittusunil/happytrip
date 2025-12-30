'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Layout, Button, Input, Card } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useSearchStore } from '@/store/searchStore';
import { apiService } from '@/services/api';
import { Booking, BookingStatus, BookingType, PaginatedResponse } from '@/types';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiCalendar,
  FiLock,
  FiSettings,
  FiShield,
  FiTrash2,
  FiPower,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiX,
  FiEdit,
  FiSave,
} from 'react-icons/fi';
import Link from 'next/link';

type TabType = 'overview' | 'profile' | 'bookings' | 'preferences' | 'security' | 'settings';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const { currency, language, setCurrency, setLanguage, recentSearches, clearRecentSearches } =
    useSearchStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      country: user?.country || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm<PasswordFormData>();

  const newPassword = watch('newPassword');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || '',
        country: user.country || '',
      });
    }
  }, [user, resetProfile]);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Update store if needed
        } catch (error) {
          console.error('Failed to parse recent searches:', error);
        }
      }
    }
  }, []);

  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const response: PaginatedResponse<Booking> = await apiService.getBookings(1, 5);
      setBookings(response.data);
    } catch (error: any) {
      // Try to load from localStorage for guest bookings
      const guestBookings = JSON.parse(localStorage.getItem('guestBookings') || '[]');
      setBookings(guestBookings.slice(0, 5));
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const updatedUser = await apiService.updateProfile(data);
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Note: This endpoint might not exist yet, but we'll handle it gracefully
      // For now, we'll show a message that this feature is coming soon
      toast.error('Password change feature is coming soon');
      return;
      toast.success('Password updated successfully!');
      resetPassword();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    try {
      await apiService.updatePreferences(language, newCurrency);
      setCurrency(newCurrency);
      toast.success('Currency updated!');
    } catch (error) {
      toast.error('Failed to update currency');
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      await apiService.updatePreferences(newLanguage, currency);
      setLanguage(newLanguage);
      toast.success('Language updated!');
    } catch (error) {
      toast.error('Failed to update language');
    }
  };

  const handleDeactivateAccount = async () => {
    if (!confirm('Are you sure you want to deactivate your account? You can reactivate it later by logging in.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Note: This endpoint might need to be implemented
      toast.info('Account deactivation feature is coming soon');
      // await apiService.api.put(`/users/${user?.id}/deactivate`);
      // toast.success('Account deactivated successfully');
      // logout();
      // router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to deactivate account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Note: This endpoint might need to be implemented
      toast.info('Account deletion feature is coming soon');
      // await apiService.api.delete(`/users/${user?.id}`);
      // toast.success('Account deleted successfully');
      // logout();
      // router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: FiUser },
    { id: 'profile' as TabType, label: 'Profile', icon: FiUser },
    { id: 'bookings' as TabType, label: 'Bookings', icon: FiCalendar },
    { id: 'preferences' as TabType, label: 'Preferences', icon: FiGlobe },
    { id: 'security' as TabType, label: 'Security', icon: FiLock },
    { id: 'settings' as TabType, label: 'Settings', icon: FiSettings },
  ];

  if (!user) {
    return (
      <Layout>
        <div className='container-responsive py-12'>
          <p className='text-center text-gray-600'>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='container-responsive py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900'>My Account</h1>
          <p className='text-gray-600 mt-2'>Manage your account settings and preferences</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Sidebar Navigation */}
          <div className='lg:col-span-1'>
            <Card className='p-2'>
              <nav className='space-y-1'>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className='w-5 h-5' />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-3'>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className='space-y-6'>
                {/* Welcome Card */}
                <Card>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                        Welcome back, {user.firstName}!
                      </h2>
                      <p className='text-gray-600'>Here's an overview of your account</p>
                    </div>
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.firstName}
                        className='w-16 h-16 rounded-full object-cover'
                      />
                    ) : (
                      <div className='w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center'>
                        <FiUser className='w-8 h-8 text-primary-600' />
                      </div>
                    )}
                  </div>
                </Card>

                {/* Quick Stats */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <Card>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center'>
                        <FiCalendar className='w-6 h-6 text-blue-600' />
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Total Bookings</p>
                        <p className='text-2xl font-bold text-gray-900'>{bookings.length}</p>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center'>
                        <FiCheckCircle className='w-6 h-6 text-green-600' />
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Confirmed</p>
                        <p className='text-2xl font-bold text-gray-900'>
                          {bookings.filter((b) => b.status === 'confirmed').length}
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center'>
                        <FiSearch className='w-6 h-6 text-purple-600' />
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Recent Searches</p>
                        <p className='text-2xl font-bold text-gray-900'>{recentSearches.length}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Recent Bookings */}
                <Card>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-xl font-semibold text-gray-900'>Recent Bookings</h3>
                    <Link href='/bookings'>
                      <Button variant='outline' size='sm'>
                        View All
                      </Button>
                    </Link>
                  </div>
                  {isLoadingBookings ? (
                    <p className='text-gray-600 text-center py-4'>Loading bookings...</p>
                  ) : bookings.length === 0 ? (
                    <div className='text-center py-8'>
                      <FiCalendar className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                      <p className='text-gray-600'>No bookings yet</p>
                      <Link href='/flights' className='text-primary-600 hover:underline mt-2 inline-block'>
                        Start booking
                      </Link>
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {bookings.slice(0, 3).map((booking) => (
                        <div
                          key={booking.id}
                          className='flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50'
                        >
                          <div className='flex items-center gap-3'>
                            <div className='text-2xl'>
                              {booking.type === BookingType.FLIGHT ? '✈️' : '🏨'}
                            </div>
                            <div>
                              <p className='font-medium text-gray-900'>
                                {booking.type === BookingType.FLIGHT ? 'Flight' : 'Accommodation'} Booking
                              </p>
                              <p className='text-sm text-gray-600'>
                                Reference: {booking.referenceId || booking.id}
                              </p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className='font-semibold text-gray-900'>
                              {booking.totalPrice.toFixed(2)} {booking.currency}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs ${
                                booking.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <Card>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-xl font-semibold text-gray-900'>Recent Searches</h3>
                      <Button variant='outline' size='sm' onClick={clearRecentSearches}>
                        Clear All
                      </Button>
                    </div>
                    <div className='space-y-2'>
                      {recentSearches.slice(0, 5).map((search, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between p-3 border border-gray-200 rounded-lg'
                        >
                          <div className='flex items-center gap-2'>
                            <FiSearch className='w-4 h-4 text-gray-400' />
                            <span className='text-sm text-gray-700'>
                              {search.type === 'flight'
                                ? `${search.departure} → ${search.arrival}`
                                : `${search.city} - ${search.checkInDate}`}
                            </span>
                          </div>
                          <span className='text-xs text-gray-500'>
                            {new Date(search.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <div className='flex items-start justify-between mb-6'>
                  <div>
                    <h2 className='text-xl font-semibold text-gray-900'>Personal Information</h2>
                    <p className='text-sm text-gray-600 mt-1'>Update your profile details</p>
                  </div>
                  <Button
                    variant={isEditingProfile ? 'outline' : 'primary'}
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? (
                      <>
                        <FiX className='w-4 h-4 mr-2' />
                        Cancel
                      </>
                    ) : (
                      <>
                        <FiEdit className='w-4 h-4 mr-2' />
                        Edit
                      </>
                    )}
                  </Button>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <Input
                        label='First Name'
                        icon={<FiUser className='w-5 h-5' />}
                        error={profileErrors.firstName?.message}
                        {...registerProfile('firstName', { required: 'First name is required' })}
                      />
                      <Input
                        label='Last Name'
                        icon={<FiUser className='w-5 h-5' />}
                        error={profileErrors.lastName?.message}
                        {...registerProfile('lastName', { required: 'Last name is required' })}
                      />
                    </div>

                    <Input
                      label='Email Address'
                      type='email'
                      icon={<FiMail className='w-5 h-5' />}
                      value={user.email}
                      disabled
                    />

                    <Input
                      label='Phone Number'
                      type='tel'
                      icon={<FiPhone className='w-5 h-5' />}
                      error={profileErrors.phoneNumber?.message}
                      {...registerProfile('phoneNumber')}
                    />

                    <Input
                      label='Country'
                      icon={<FiMapPin className='w-5 h-5' />}
                      error={profileErrors.country?.message}
                      {...registerProfile('country')}
                    />

                    <div className='flex gap-3 pt-4'>
                      <Button type='submit' isLoading={isLoading} disabled={isLoading}>
                        <FiSave className='w-4 h-4 mr-2' />
                        Save Changes
                      </Button>
                      <Button variant='outline' onClick={() => setIsEditingProfile(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-gray-600'>First Name</p>
                        <p className='text-lg font-medium text-gray-900'>{user.firstName}</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Last Name</p>
                        <p className='text-lg font-medium text-gray-900'>{user.lastName}</p>
                      </div>
                    </div>

                    <div>
                      <p className='text-sm text-gray-600'>Email Address</p>
                      <p className='text-lg font-medium text-gray-900'>{user.email}</p>
                      {user.emailVerified && (
                        <span className='inline-flex items-center gap-1 text-xs text-green-600 mt-1'>
                          <FiCheckCircle className='w-3 h-3' />
                          Verified
                        </span>
                      )}
                    </div>

                    {user.phoneNumber && (
                      <div>
                        <p className='text-sm text-gray-600'>Phone Number</p>
                        <p className='text-lg font-medium text-gray-900'>{user.phoneNumber}</p>
                      </div>
                    )}

                    {user.country && (
                      <div>
                        <p className='text-sm text-gray-600'>Country</p>
                        <p className='text-lg font-medium text-gray-900'>{user.country}</p>
                      </div>
                    )}

                    <div className='pt-4 border-t border-gray-200'>
                      <p className='text-sm text-gray-600'>Member Since</p>
                      <p className='text-lg font-medium text-gray-900'>
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <Card>
                <h2 className='text-xl font-semibold text-gray-900 mb-6'>My Bookings</h2>
                {isLoadingBookings ? (
                  <p className='text-gray-600 text-center py-8'>Loading bookings...</p>
                ) : bookings.length === 0 ? (
                  <div className='text-center py-12'>
                    <FiCalendar className='w-16 h-16 text-gray-400 mx-auto mb-4' />
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
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {bookings.map((booking) => (
                      <div key={booking.id} className='border border-gray-200 rounded-lg p-4'>
                        <div className='flex items-start justify-between mb-4'>
                          <div className='flex items-center gap-3'>
                            <div className='text-2xl'>
                              {booking.type === BookingType.FLIGHT ? '✈️' : '🏨'}
                            </div>
                            <div>
                              <h3 className='font-semibold text-gray-900'>
                                {booking.type === BookingType.FLIGHT ? 'Flight' : 'Accommodation'} Booking
                              </h3>
                              <p className='text-sm text-gray-600'>
                                Reference: {booking.referenceId || booking.id}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                          {booking.checkInDate && (
                            <div>
                              <p className='text-xs text-gray-600'>Check-in</p>
                              <p className='text-sm font-medium'>
                                {new Date(booking.checkInDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {booking.checkOutDate && (
                            <div>
                              <p className='text-xs text-gray-600'>Check-out</p>
                              <p className='text-sm font-medium'>
                                {new Date(booking.checkOutDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
                          <p className='text-lg font-bold text-gray-900'>
                            {booking.totalPrice.toFixed(2)} {booking.currency}
                          </p>
                          <Link href={`/bookings/confirmation/${booking.id}`}>
                            <Button variant='outline' size='sm'>
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    <div className='pt-4 text-center'>
                      <Link href='/bookings'>
                        <Button variant='outline'>View All Bookings</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <Card>
                <h2 className='text-xl font-semibold text-gray-900 mb-6'>Preferences</h2>
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <FiGlobe className='w-4 h-4 inline mr-2' />
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
                    >
                      <option value='EUR'>Euro (EUR)</option>
                      <option value='GBP'>British Pound (GBP)</option>
                      <option value='USD'>US Dollar (USD)</option>
                      <option value='CHF'>Swiss Franc (CHF)</option>
                      <option value='SEK'>Swedish Krona (SEK)</option>
                      <option value='NOK'>Norwegian Krone (NOK)</option>
                      <option value='DKK'>Danish Krone (DKK)</option>
                      <option value='CZK'>Czech Koruna (CZK)</option>
                      <option value='PLN'>Polish Zloty (PLN)</option>
                      <option value='HUF'>Hungarian Forint (HUF)</option>
                      <option value='RON'>Romanian Leu (RON)</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <FiGlobe className='w-4 h-4 inline mr-2' />
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
                    >
                      <option value='en'>English</option>
                      <option value='de'>Deutsch</option>
                      <option value='fr'>Français</option>
                      <option value='es'>Español</option>
                      <option value='it'>Italiano</option>
                      <option value='pt'>Português</option>
                      <option value='nl'>Nederlands</option>
                      <option value='pl'>Polski</option>
                      <option value='cs'>Čeština</option>
                      <option value='hu'>Magyar</option>
                      <option value='ro'>Română</option>
                      <option value='sv'>Svenska</option>
                      <option value='no'>Norsk</option>
                      <option value='da'>Dansk</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <Card>
                <h2 className='text-xl font-semibold text-gray-900 mb-6'>Change Password</h2>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className='space-y-4 max-w-md'>
                  <Input
                    label='Current Password'
                    type='password'
                    icon={<FiLock className='w-5 h-5' />}
                    error={passwordErrors.currentPassword?.message}
                    {...registerPassword('currentPassword', { required: 'Current password is required' })}
                  />
                  <Input
                    label='New Password'
                    type='password'
                    icon={<FiLock className='w-5 h-5' />}
                    error={passwordErrors.newPassword?.message}
                    {...registerPassword('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                  />
                  <Input
                    label='Confirm New Password'
                    type='password'
                    icon={<FiLock className='w-5 h-5' />}
                    error={passwordErrors.confirmPassword?.message}
                    {...registerPassword('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === newPassword || 'Passwords do not match',
                    })}
                  />
                  <Button type='submit' isLoading={isLoading} disabled={isLoading}>
                    Update Password
                  </Button>
                </form>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className='space-y-6'>
                <Card>
                  <h2 className='text-xl font-semibold text-gray-900 mb-6'>Account Settings</h2>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                      <div>
                        <h3 className='font-medium text-gray-900'>Email Verification</h3>
                        <p className='text-sm text-gray-600'>
                          {user.emailVerified
                            ? 'Your email is verified'
                            : 'Please verify your email address'}
                        </p>
                      </div>
                      {user.emailVerified ? (
                        <FiCheckCircle className='w-6 h-6 text-green-600' />
                      ) : (
                        <Button size='sm' variant='outline'>
                          Verify
                        </Button>
                      )}
                    </div>

                    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                      <div>
                        <h3 className='font-medium text-gray-900'>Account Status</h3>
                        <p className='text-sm text-gray-600'>
                          {user.isActive ? 'Your account is active' : 'Your account is inactive'}
                        </p>
                      </div>
                      {user.isActive ? (
                        <FiCheckCircle className='w-6 h-6 text-green-600' />
                      ) : (
                        <FiClock className='w-6 h-6 text-yellow-600' />
                      )}
                    </div>
                  </div>
                </Card>

                <Card>
                  <h2 className='text-xl font-semibold text-gray-900 mb-6 text-red-600'>
                    Danger Zone
                  </h2>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50'>
                      <div>
                        <h3 className='font-medium text-gray-900'>Deactivate Account</h3>
                        <p className='text-sm text-gray-600'>
                          Temporarily disable your account. You can reactivate it later.
                        </p>
                      </div>
                      <Button variant='outline' onClick={handleDeactivateAccount} disabled={isLoading}>
                        <FiPower className='w-4 h-4 mr-2' />
                        Deactivate
                      </Button>
                    </div>

                    <div className='flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50'>
                      <div>
                        <h3 className='font-medium text-gray-900'>Delete Account</h3>
                        <p className='text-sm text-gray-600'>
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <Button
                        variant='outline'
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isLoading}
                        className='text-red-600 border-red-300 hover:bg-red-100'
                      >
                        <FiTrash2 className='w-4 h-4 mr-2' />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>

                {showDeleteConfirm && (
                  <Card className='border-2 border-red-200'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>Confirm Account Deletion</h3>
                    <p className='text-gray-600 mb-4'>
                      Are you absolutely sure? This will permanently delete your account and all your data. This
                      action cannot be undone.
                    </p>
                    <div className='flex gap-3'>
                      <Button
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                        className='bg-red-600 hover:bg-red-700'
                      >
                        Yes, Delete My Account
                      </Button>
                      <Button variant='outline' onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
