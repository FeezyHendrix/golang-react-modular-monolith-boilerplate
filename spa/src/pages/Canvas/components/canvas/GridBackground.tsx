
import React, { memo } from 'react';

const GridBackground: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundImage: 'radial-gradient(#e4e4e7 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        zIndex: -1
      }} 
    />
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(GridBackground);
