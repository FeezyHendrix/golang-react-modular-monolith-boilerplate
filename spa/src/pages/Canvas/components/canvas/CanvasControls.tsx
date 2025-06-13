
import React, { memo } from 'react';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface CanvasControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const CanvasControls: React.FC<CanvasControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset
}) => {
  return (
    <div className="absolute top-2 right-2 z-10 flex space-x-2 bg-white p-2 rounded-md shadow">
      <button
        className="p-1 hover:bg-gray-100 rounded flex items-center gap-1"
        onClick={onZoomIn}
        type="button"
      >
        <ZoomIn size={16} />
        <span>Zoom +</span>
      </button>
      <button
        className="p-1 hover:bg-gray-100 rounded flex items-center gap-1"
        onClick={onZoomOut}
        type="button"
      >
        <ZoomOut size={16} />
        <span>Zoom -</span>
      </button>
      <button
        className="p-1 hover:bg-gray-100 rounded flex items-center gap-1"
        onClick={onReset}
        type="button"
      >
        <RefreshCw size={16} />
        <span>Reset</span>
      </button>
    </div>
  );
};

export default memo(CanvasControls);
