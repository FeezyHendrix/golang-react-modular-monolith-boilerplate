import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { WorkflowNode } from './types';
import { CirclePlus, Clock, DatabaseZap, Mail, Bell, Database, FileDown, Search, Code, Filter, GitMerge, Play, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const getNodeIcon = (iconName: string) => {
  const iconProps = { className: "h-4 w-4" };
  
  switch(iconName) {
    case 'file-up': return <FileUp {...iconProps} />;
    case 'clock': return <Clock {...iconProps} />;
    case 'database-zap': return <DatabaseZap {...iconProps} />;
    case 'mail': return <Mail {...iconProps} />;
    case 'bell': return <Bell {...iconProps} />;
    case 'database': return <Database {...iconProps} />;
    case 'file-down': return <FileDown {...iconProps} />;
    case 'search': return <Search {...iconProps} />;
    case 'code': return <Code {...iconProps} />;
    case 'filter': return <Filter {...iconProps} />;
    case 'join': return <GitMerge {...iconProps} />; // Changed from Join to GitMerge
    case 'play': return <Play {...iconProps} />;
    default: return <div className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch(category) {
    case 'trigger': return '#9b87f5'; // Purple
    case 'action': return '#0EA5E9'; // Ocean Blue
    case 'data': return '#10b981'; // Green
    case 'ai': return '#F97316'; // Orange
    case 'condition': return '#ea384c'; // Red
    case 'utility': return '#6b7280'; // Gray
    default: return '#94a3b8'; // Slate
  }
};

const getStatusColor = (status?: string) => {
  switch(status) {
    case 'running': return 'bg-yellow-500';
    case 'success': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

interface WorkflowNodeProps {
  data: WorkflowNode & {
    onClick: () => void;
    onRemove: () => void;
  };
  isConnectable: boolean;
}

const WorkflowNodeComponent = ({ data, isConnectable }: WorkflowNodeProps) => {
  const {
    label,
    type,
    category,
    enabled,
    status,
    onClick,
  } = data;
  
  const color = getCategoryColor(category);
  
  return (
    <div className="group relative">
      {/* Connection dot */}
      <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-10">
        <button 
          className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <CirclePlus className="h-4 w-4" style={{ color }} />
        </button>
      </div>

      {/* Input handle */}
      {category !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable && enabled}
          style={{ background: color }}
          className="!w-3 !h-3 !border-2"
        />
      )}
      
      <div 
        className={cn(
          "px-4 py-3 rounded-lg shadow-lg",
          "border-l-4 bg-white dark:bg-gray-800",
          "min-w-[180px] max-w-[250px]",
          !enabled && "opacity-60"
        )}
        style={{ borderLeftColor: color }}
        onClick={onClick}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg" style={{ color }}>
            {getNodeIcon(type)}
          </span>
          <span className="font-medium text-sm">
            {label}
          </span>
          <div className={cn(
            "w-2 h-2 rounded-full ml-auto",
            getStatusColor(status)
          )} />
        </div>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable && enabled}
        style={{ background: color }}
        className="!w-3 !h-3 !border-2"
      />
    </div>
  );
};

export default memo(WorkflowNodeComponent);
