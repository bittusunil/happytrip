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
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 flex items-center justify-center py-12 px-4'>
        <div className='w-full max-w-md'>
          {/* Card */}
          <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-10'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/20'>
                <span className='text-white font-bold text-xl'>HT</span>
              </div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back</h1>
              <p className='text-gray-600'>Sign in to your HappyTrip account</p>
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
                <label className='flex items-center gap-2 cursor-pointer group'>
                  <input type='checkbox' className='w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer' />
                  <span className='text-gray-700 group-hover:text-gray-900 transition-colors'>Remember me</span>
                </label>
                <Link href='/forgot-password' className='text-primary-600 hover:text-primary-700 font-medium transition-colors'>
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                fullWidth
                isLoading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
                className='mt-6 shadow-lg hover:shadow-xl transition-all duration-300'
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className='relative my-8'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-white text-gray-500'>Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className='grid grid-cols-2 gap-3'>
              <Button variant='outline' disabled className='!border-gray-200 hover:!bg-gray-50 !text-gray-500'>
                Google
              </Button>
              <Button variant='outline' disabled className='!border-gray-200 hover:!bg-gray-50 !text-gray-500'>
                Facebook
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className='text-center text-sm text-gray-600 mt-8'>
              Don't have an account?{' '}
              <Link href='/register' className='text-primary-600 hover:text-primary-700 font-semibold transition-colors'>
                Sign up
              </Link>
            </p>
          </div>

          {/* Footer Text */}
          <p className='text-center text-xs text-gray-500 mt-6'>
            By signing in, you agree to our{' '}
            <Link href='/terms' className='text-primary-600 hover:text-primary-700 transition-colors'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href='/privacy' className='text-primary-600 hover:text-primary-700 transition-colors'>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
