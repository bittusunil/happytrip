'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Layout, Button, Input } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { FiMail, FiLock } from 'react-icons/fi';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, isLoading, error, clearError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
  });

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

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
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
              <h1 className='text-2xl font-bold text-gray-900'>Welcome Back</h1>
              <p className='text-gray-600 text-sm mt-2'>Sign in to your HappyTrip account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {/* Email */}
              <Input
                label='Email Address'
                type='email'
                placeholder='you@example.com'
                icon={<FiMail className='w-5 h-5' />}
                error={errors.email?.message}
                {...register('email', {
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
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />

              {/* Remember Me & Forgot Password */}
              <div className='flex items-center justify-between text-sm'>
                <label className='flex items-center gap-2'>
                  <input type='checkbox' className='w-4 h-4 rounded border-gray-300' />
                  <span className='text-gray-700'>Remember me</span>
                </label>
                <Link href='/forgot-password' className='text-primary-500 hover:text-primary-600'>
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                fullWidth
                isLoading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className='grid grid-cols-2 gap-4'>
              <Button variant='outline' disabled>
                Google
              </Button>
              <Button variant='outline' disabled>
                Facebook
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className='text-center text-sm text-gray-600 mt-6'>
              Don't have an account?{' '}
              <Link href='/register' className='text-primary-500 hover:text-primary-600 font-medium'>
                Sign up
              </Link>
            </p>
          </div>

          {/* Footer Text */}
          <p className='text-center text-xs text-gray-500 mt-6'>
            By signing in, you agree to our{' '}
            <Link href='/terms' className='text-primary-500 hover:text-primary-600'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href='/privacy' className='text-primary-500 hover:text-primary-600'>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
