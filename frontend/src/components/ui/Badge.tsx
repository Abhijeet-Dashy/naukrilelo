import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primaryText text-background": variant === 'default',
          "bg-success/20 text-success": variant === 'success',
          "bg-warning/20 text-warning": variant === 'warning',
          "bg-danger/20 text-danger": variant === 'danger',
          "text-primaryText border border-border": variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}
