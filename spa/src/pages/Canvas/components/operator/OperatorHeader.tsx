
import React from 'react';
import { X } from 'lucide-react';
import OperatorIcon from './OperatorIcon';
import { OperatorType } from '../../types';

interface OperatorHeaderProps {
  type: OperatorType;
  isConfigured: boolean;
  onRemove: (e: React.MouseEvent) => void;
}

const OperatorHeader: React.FC<OperatorHeaderProps> = ({
  type,
  isConfigured,
  onRemove
}) => {
  return (
    <div className={`flex items-center justify-between bg-blue-500 text-white p-2 rounded-t-md ${isConfigured ? 'bg-green-500' : ''}`}>
      <div className="flex items-center space-x-2">
        <OperatorIcon type={type} />
        <span className="font-medium capitalize">{type}</span>
      </div>
      <button
        className="p-1 hover:bg-blue-600 rounded"
        onClick={onRemove}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default OperatorHeader;
