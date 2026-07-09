import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-vercel focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryText/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-primaryText text-background hover:bg-[#EBEBEB] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]": variant === 'primary',
            "bg-surface text-primaryText border border-transparent hover:border-border hover:bg-[#2e2e2e]": variant === 'secondary',
            "border border-border bg-transparent text-primaryText hover:border-primaryText hover:bg-surface": variant === 'outline',
            "text-secondaryText hover:text-primaryText hover:bg-surface/60": variant === 'ghost',
            "h-8 px-3 text-xs": size === 'sm',
            "h-10 px-4 text-sm": size === 'md',
            "h-12 px-6 text-base": size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
