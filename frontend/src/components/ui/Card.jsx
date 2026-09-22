import React from 'react';
import { cn } from './Button';

export const Card = ({ className, children, ...props }) => {
  return (
    <div className={cn("bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("px-6 py-4 border-b border-gray-100", className)} {...props}>
    {children}
  </div>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn("p-6", className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn("px-6 py-4 border-t border-gray-100 bg-gray-50", className)} {...props}>
    {children}
  </div>
);
