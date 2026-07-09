import React from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 text-secondaryText">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primaryText file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondaryText focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primaryText disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
            icon && "pl-10",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
