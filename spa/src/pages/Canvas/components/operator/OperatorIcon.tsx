
import React from 'react';
import { 
  Database, GitMerge, Filter, Columns, BarChart3, GitCompare, 
  SortDesc, List, FileSearch 
} from 'lucide-react';
import { OperatorType } from '../../types';

interface OperatorIconProps {
  type: OperatorType;
  size?: number;
}

const OperatorIcon: React.FC<OperatorIconProps> = ({ type, size = 20 }) => {
  switch (type) {
    case 'source':
      return <Database size={size} />;
    case 'join':
      return <GitMerge size={size} />;
    case 'filter':
      return <Filter size={size} />;
    case 'select':
      return <Columns size={size} />;
    case 'aggregate':
      return <BarChart3 size={size} />;
    case 'union':
      return <GitCompare size={size} />;
    case 'sort':
      return <SortDesc size={size} />;
    case 'limit':
      return <List size={size} />;
    case 'analyze':
      return <FileSearch size={size} />;
    default:
      return null;
  }
};

export default OperatorIcon;
