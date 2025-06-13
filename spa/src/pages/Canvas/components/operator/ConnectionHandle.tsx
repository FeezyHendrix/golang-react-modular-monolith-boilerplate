
import React, { memo } from 'react';
import { ArrowRight } from 'lucide-react';

interface ConnectionHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
}

const ConnectionHandle: React.FC<ConnectionHandleProps> = ({ onMouseDown }) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent event bubbling which might be causing cascading updates
    e.stopPropagation();
    onMouseDown(e);
  };

  return (
    <div
      className="absolute w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-crosshair hover:bg-blue-600"
      style={{ right: -3, top: '50%', transform: 'translateY(-50%)' }}
      onMouseDown={handleMouseDown}
    >
      <ArrowRight size={12} className="text-white" />
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(ConnectionHandle);
