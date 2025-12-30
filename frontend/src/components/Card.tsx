import React from 'react';
import clsx from 'clsx';

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
      <div
        ref={ref}
        className={clsx(
          'bg-white rounded-lg border border-gray-200 transition-all duration-200',
          hoverable && 'hover:shadow-lg hover:border-gray-300 cursor-pointer',
          paddingStyles[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
