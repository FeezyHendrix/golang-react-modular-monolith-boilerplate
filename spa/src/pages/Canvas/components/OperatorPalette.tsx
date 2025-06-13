
import React from 'react';
import { OperatorType, Position } from '../types';
import { 
  Database, GitMerge, Filter, Columns, BarChart3, 
  GitCompare, SortDesc, List, FileSearch
} from 'lucide-react';

interface OperatorPaletteProps {
  onAddOperator: (type: OperatorType, position: Position) => void;
}

const OperatorPalette: React.FC<OperatorPaletteProps> = ({ onAddOperator }) => {
  const operators = [
    { type: 'source', label: 'Source', icon: <Database size={16} /> },
    { type: 'join', label: 'Join', icon: <GitMerge size={16} /> },
    { type: 'filter', label: 'Filter', icon: <Filter size={16} /> },
    { type: 'select', label: 'Select', icon: <Columns size={16} /> },
    { type: 'aggregate', label: 'Aggregate', icon: <BarChart3 size={16} /> },
    { type: 'union', label: 'Union', icon: <GitCompare size={16} /> },
    { type: 'sort', label: 'Sort', icon: <SortDesc size={16} /> },
    { type: 'limit', label: 'Limit', icon: <List size={16} /> },
    { type: 'analyze', label: 'Analyze Text', icon: <FileSearch size={16} /> },
  ];

  const handleDragStart = (e: React.DragEvent, type: OperatorType) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full bg-gray-50 p-4 overflow-y-auto">
      <h3 className="text-sm font-medium mb-3">Operators</h3>
      <div className="space-y-2">
        {operators.map(op => (
          <div
            key={op.type}
            draggable
            onDragStart={(e) => handleDragStart(e, op.type as OperatorType)}
            onClick={() => onAddOperator(op.type as OperatorType, { x: 200, y: 200 })}
            className="bg-white flex items-center p-2 rounded shadow-sm cursor-grab hover:bg-gray-50 border border-gray-200"
          >
            <div className="mr-2 text-blue-500">{op.icon}</div>
            <span className="text-sm">{op.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-700">
        <p>Drag operators to the canvas or click to add at default position</p>
      </div>
    </div>
  );
};

export default OperatorPalette;
