import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ className, size = 24 }) {
  return (
    <Loader2 
      className={`animate-spin text-primary-500 ${className}`} 
      size={size} 
    />
  );
}
