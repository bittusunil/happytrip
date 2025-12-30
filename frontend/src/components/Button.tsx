import React from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends Omit<ShadcnButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const variantMap: Record<string, ShadcnButtonProps['variant']> = {
      primary: 'default',
      secondary: 'secondary',
      outline: 'outline',
      ghost: 'ghost',
      destructive: 'destructive',
      link: 'link',
    };

    const sizeMap: Record<string, ShadcnButtonProps['size']> = {
      sm: 'sm',
      md: 'default',
      lg: 'lg',
      icon: 'icon',
    };

    return (
      <ShadcnButton
        ref={ref}
        variant={variantMap[variant]}
        size={sizeMap[size]}
        disabled={disabled || isLoading}
        className={cn(fullWidth && 'w-full', className)}
        {...props}
      >
        {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        {children}
      </ShadcnButton>
    );
  },
);

Button.displayName = 'Button';

export default Button;
