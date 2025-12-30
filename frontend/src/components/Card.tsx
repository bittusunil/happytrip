import React from 'react';
import { Card as ShadcnCard } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hoverable = false, padding = 'md', className, ...props }, ref) => {
    const paddingStyles = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <ShadcnCard
        ref={ref}
        className={cn(
          'transition-all duration-200',
          hoverable && 'hover:shadow-lg hover:border-primary/50 cursor-pointer',
          paddingStyles[padding],
          className,
        )}
        {...props}
      >
        {children}
      </ShadcnCard>
    );
  },
);

Card.displayName = 'Card';

export default Card;
