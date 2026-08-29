'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GovInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: boolean;
}

const GovInput = forwardRef<HTMLInputElement, GovInputProps>(
  ({ className, icon: Icon, error, ...props }, ref) => {
    return (
      <div className="relative flex-1 min-w-0">
        {Icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center">
            <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'gov-input w-full pl-4',
            Icon && 'pl-11',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-200/50',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
GovInput.displayName = 'GovInput';

export default GovInput;
