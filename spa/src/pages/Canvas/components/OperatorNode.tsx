
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { OperatorData, Position, OperatorStatus } from '../types';
import { Check } from 'lucide-react';
import OperatorHeader from './operator/OperatorHeader';
import OperatorDetails from './operator/OperatorDetails';
import ConnectionHandle from './operator/ConnectionHandle';

interface OperatorNodeProps {
  operator: OperatorData;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (position: Position) => void;
  onRemove: () => void;
  onConnectionStart: (sourceId: string, sourceHandle: string | undefined, x: number, y: number) => void;
  onConnectionEnd: (targetId: string, targetHandle: string | undefined) => void;
  onConnectionCancel: () => void;
}

const OperatorNode: React.FC<OperatorNodeProps> = ({
  operator,
  isSelected,
  onSelect,
  onMove,
  onRemove,
  onConnectionStart,
  onConnectionEnd,
  onConnectionCancel
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    
    e.stopPropagation();
    setIsDragging(true);
    onSelect();
    
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, [onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !nodeRef.current) return;

    const canvasEditor = document.getElementById('canvas-editor');
    if (!canvasEditor) return;
    
    const canvasRect = canvasEditor.getBoundingClientRect();
    const transformStyle = window.getComputedStyle(canvasEditor.firstElementChild as Element).transform;
    
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    
    if (transformStyle && transformStyle !== 'none') {
      const matrix = transformStyle.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        const values = matrix[1].split(',').map(parseFloat);
        scale = values[0];
        translateX = values[4];
        translateY = values[5];
      }
    }
    
    const newX = (e.clientX - canvasRect.left - dragOffset.x - translateX) / scale;
    const newY = (e.clientY - canvasRect.top - dragOffset.y - translateY) / scale;
    
    const snappedX = Math.round(newX / 20) * 20;
    const snappedY = Math.round(newY / 20) * 20;
    
    onMove({ x: snappedX, y: snappedY });
  }, [isDragging, dragOffset, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleConnectionStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!nodeRef.current) return;
    
    const x = operator.position.x + operator.size.width;
    const y = operator.position.y + operator.size.height / 2;
    onConnectionStart(operator.id, undefined, x, y);
  }, [operator.id, operator.position.x, operator.position.y, operator.size.width, operator.size.height, onConnectionStart]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  }, [onRemove]);

  const isConfigured = operator.status === OperatorStatus.CONFIGURED;

  return (
    <div
      ref={nodeRef}
      data-node-id={operator.id}
      className={`absolute rounded-md shadow-md ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        left: operator.position.x,
        top: operator.position.y,
        width: operator.size.width,
        height: operator.size.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        backgroundColor: 'white',
        zIndex: isSelected ? 10 : 1
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <OperatorHeader 
        type={operator.type} 
        isConfigured={isConfigured} 
        onRemove={handleRemove}
      />
      
      <div className="p-2 text-xs overflow-hidden">
        <OperatorDetails operator={operator} />
        {isConfigured && (
          <div className="flex items-center mt-2 text-green-600 font-medium text-xs">
            <Check size={14} className="mr-1" />
            <span>Configured</span>
          </div>
        )}
      </div>
      
      <ConnectionHandle onMouseDown={handleConnectionStart} />
    </div>
  );
};

export default OperatorNode;
