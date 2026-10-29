import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'terracotta' | 'forest' | 'caramel' | 'surface' | 'neutral';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'surface', children, ...props }, ref) => {
    const variantStyles = {
      terracotta: 'bg-surface-container-high text-primary',
      forest: 'bg-secondary-container text-secondary font-medium',
      caramel: 'bg-[#ffecc8] text-tertiary',
      surface: 'bg-surface-container-low text-on-surface-variant',
      neutral: 'bg-surface-container text-on-surface',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none leading-tight transition-colors',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
