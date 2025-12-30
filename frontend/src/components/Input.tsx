import React from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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
          <Label className='mb-2' htmlFor={props.id}>
            {label}
          </Label>
        )}
        <div className='relative'>
          {icon && (
            <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
              {icon}
            </div>
          )}
          <ShadcnInput
            ref={ref}
            className={cn(
              icon && 'pl-10',
              error && 'border-destructive focus-visible:ring-destructive',
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className='mt-1 text-sm text-destructive'>{error}</p>}
        {helperText && !error && (
          <p className='mt-1 text-sm text-muted-foreground'>{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
