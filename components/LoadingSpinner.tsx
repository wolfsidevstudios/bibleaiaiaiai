
import React from 'react';

const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 ${className}`}></div>
  );
};

export default LoadingSpinner;
