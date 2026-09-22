import React from 'react';
import { cn } from './Button';

export const Input = React.forwardRef(({ className, error, label, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-700',
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
