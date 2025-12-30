import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {label}
          </label>
        )}
        <div className='relative'>
          {icon && <div className='absolute left-3 top-3 text-gray-400'>{icon}</div>}
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200',
              icon && 'pl-10',
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-transparent'
                : 'border-gray-300 focus:ring-primary-500 focus:border-transparent',
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
        {helperText && !error && <p className='mt-1 text-sm text-gray-500'>{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
