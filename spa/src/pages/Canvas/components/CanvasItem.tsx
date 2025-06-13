
import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { OperatorData, OperatorStatus } from '../types';

interface CanvasItemProps {
  operator: OperatorData;
  updateOperator: (operator: OperatorData) => void;
  openConfigPanel: (operator: OperatorData) => void;
}

export const CanvasItem: React.FC<CanvasItemProps> = ({ 
  operator, 
  updateOperator,
  openConfigPanel 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'OPERATOR',
    item: operator,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  
  // Determine border and background color based on operator status
  const getStatusStyles = () => {
    switch(operator.status) {
      case OperatorStatus.CONFIGURED:
        return {
          borderColor: 'border-green-500',
          bgColor: 'bg-green-50',
        };
      case OperatorStatus.UNCONFIGURED:
      case OperatorStatus.IDLE:
      default:
        return {
          borderColor: 'border-blue-500',
          bgColor: 'bg-blue-50',
        };
    }
  };

  const statusStyles = getStatusStyles();
  
  // Set position via inline style
  const style: React.CSSProperties = {
    position: 'absolute',
    left: operator.position.x,
    top: operator.position.y,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
  };
  
  // Apply drag ref to the div
  drag(ref);

  // Create class string for the operator that includes its type and configuration status
  const operatorClassNames = `
    operator-${operator.type}
    ${operator.status === OperatorStatus.CONFIGURED ? 'configured' : ''}
    shadow-sm hover:shadow-md transition-shadow 
    border-2 rounded-md p-4 w-[200px]
    ${statusStyles.borderColor} 
    ${statusStyles.bgColor}
  `;
  
  return (
    <div 
      ref={ref} 
      style={style}
      onClick={() => openConfigPanel(operator)}
      className={operatorClassNames}
    >
      <div className="font-medium text-base mb-1">{operator.name}</div>
      <div className="text-sm text-gray-500">{operator.type}</div>
      {operator.status === OperatorStatus.CONFIGURED && (
        <div className="text-xs text-green-600 mt-1">Configured ✓</div>
      )}
    </div>
  );
};
