'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Layout, Button, Input, Card } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useSearchStore } from '@/store/searchStore';
import { apiService } from '@/services/api';
import { FiUser, FiMail, FiPhone, FiGlobe, FiMapPin } from 'react-icons/fi';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useAuthStore();
  const { currency, language, setCurrency, setLanguage } = useSearchStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      country: user?.country || '',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        country: user.country || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const updatedUser = await apiService.updateProfile(data);
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
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
      <div className='container-responsive py-12'>
        <div className='max-w-2xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900'>My Profile</h1>
            <p className='text-gray-600 mt-2'>Manage your account settings and preferences</p>
          </div>

          {/* Profile Section */}
          <Card className='mb-6'>
            <div className='flex items-start justify-between mb-6'>
              <div>
                <h2 className='text-xl font-semibold text-gray-900'>Personal Information</h2>
                <p className='text-sm text-gray-600 mt-1'>Update your profile details</p>
              </div>
              <Button
                variant={isEditing ? 'secondary' : 'primary'}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Input
                    label='First Name'
                    icon={<FiUser className='w-5 h-5' />}
                    error={errors.firstName?.message}
                    {...register('firstName', { required: 'First name is required' })}
                  />
                  <Input
                    label='Last Name'
                    icon={<FiUser className='w-5 h-5' />}
                    error={errors.lastName?.message}
                    {...register('lastName', { required: 'Last name is required' })}
                  />
                </div>

                <Input
                  label='Email Address'
                  type='email'
                  icon={<FiMail className='w-5 h-5' />}
                  error={errors.email?.message}
                  disabled
                  {...register('email')}
                />

                <Input
                  label='Phone Number'
                  type='tel'
                  icon={<FiPhone className='w-5 h-5' />}
                  error={errors.phoneNumber?.message}
                  {...register('phoneNumber')}
                />

                <Input
                  label='Country'
                  icon={<FiMapPin className='w-5 h-5' />}
                  error={errors.country?.message}
                  {...register('country')}
                />

                <div className='flex gap-3 pt-4'>
                  <Button type='submit' isLoading={isLoading} disabled={isLoading}>
                    Save Changes
                  </Button>
                  <Button variant='outline' onClick={() => setIsEditing(false)}>
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
              </div>
            )}
          </Card>

          {/* Preferences Section */}
          <Card>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>Preferences</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Currency */}
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

              {/* Language */}
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

            {/* Account Info */}
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <h3 className='text-sm font-medium text-gray-700 mb-4'>Account Information</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-gray-600'>Member Since</p>
                  <p className='text-gray-900 font-medium'>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className='text-gray-600'>Email Verified</p>
                  <p className='text-gray-900 font-medium'>
                    {user.emailVerified ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
