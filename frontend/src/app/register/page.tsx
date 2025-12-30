'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Layout, Button, Input } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, register, isLoading, error, clearError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: 'onBlur',
  });

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data: RegisterFormData) => {
    if (!data.agreeToTerms) {
      toast.error('You must agree to the Terms of Service');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(data.email, data.password, data.firstName, data.lastName);
      toast.success('Registration successful!');
      router.push('/');
    } catch (error: any) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className='min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4'>
        <div className='w-full max-w-md'>
          {/* Card */}
          <div className='bg-white rounded-lg shadow-lg p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <span className='text-white font-bold text-lg'>HT</span>
              </div>
              <h1 className='text-2xl font-bold text-gray-900'>Create Account</h1>
              <p className='text-gray-600 text-sm mt-2'>Join HappyTrip and start exploring</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {/* First Name */}
              <Input
                label='First Name'
                type='text'
                placeholder='John'
                icon={<FiUser className='w-5 h-5' />}
                error={errors.firstName?.message}
                {...registerField('firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters',
                  },
                })}
              />

              {/* Last Name */}
              <Input
                label='Last Name'
                type='text'
                placeholder='Doe'
                icon={<FiUser className='w-5 h-5' />}
                error={errors.lastName?.message}
                {...registerField('lastName', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters',
                  },
                })}
              />

              {/* Email */}
              <Input
                label='Email Address'
                type='email'
                placeholder='you@example.com'
                icon={<FiMail className='w-5 h-5' />}
                error={errors.email?.message}
                {...registerField('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />

              {/* Password */}
              <Input
                label='Password'
                type='password'
                placeholder='Enter your password'
                icon={<FiLock className='w-5 h-5' />}
                error={errors.password?.message}
                helperText='At least 8 characters'
                {...registerField('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain uppercase, lowercase, and number',
                  },
                })}
              />

              {/* Confirm Password */}
              <Input
                label='Confirm Password'
                type='password'
                placeholder='Confirm your password'
                icon={<FiLock className='w-5 h-5' />}
                error={errors.confirmPassword?.message}
                {...registerField('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
              />

              {/* Terms & Conditions */}
              <label className='flex items-start gap-3'>
                <input
                  type='checkbox'
                  className='w-4 h-4 rounded border-gray-300 mt-1'
                  {...registerField('agreeToTerms', {
                    required: 'You must agree to the Terms of Service',
                  })}
                />
                <span className='text-sm text-gray-700'>
                  I agree to the{' '}
                  <Link href='/terms' className='text-primary-500 hover:text-primary-600'>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href='/privacy' className='text-primary-500 hover:text-primary-600'>
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className='text-sm text-red-500'>{errors.agreeToTerms.message}</p>
              )}

              {/* Submit Button */}
              <Button
                type='submit'
                fullWidth
                isLoading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
              >
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>Or sign up with</span>
              </div>
            </div>

            {/* Social Signup */}
            <div className='grid grid-cols-2 gap-4'>
              <Button variant='outline' disabled>
                Google
              </Button>
              <Button variant='outline' disabled>
                Facebook
              </Button>
            </div>

            {/* Login Link */}
            <p className='text-center text-sm text-gray-600 mt-6'>
              Already have an account?{' '}
              <Link href='/login' className='text-primary-500 hover:text-primary-600 font-medium'>
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer Text */}
          <p className='text-center text-xs text-gray-500 mt-6'>
            We'll never share your information with anyone else.
          </p>
        </div>
      </div>
    </Layout>
  );
}
