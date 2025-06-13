
export type NodeCategory = 
  | 'trigger'
  | 'action'
  | 'data'
  | 'ai'
  | 'condition'
  | 'utility';

export type NodeType = 
  // Triggers
  | 'file-upload'
  | 'schedule'
  | 'data-update'
  // Actions
  | 'email'
  | 'notification'
  | 'database'
  | 'export'
  | 'api'
  | 'sql'
  | 'python'
  | 'document'
  // Data Operators
  | 'filter'
  | 'join'
  | 'merge'
  | 'aggregate'
  // AI Operators
  | 'analyze'
  | 'report'
  | 'recommend'
  | 'chat'
  | 'extract'
  // Conditions
  | 'if'
  | 'switch'
  // Utilities
  | 'delay'
  | 'format'
  | 'webhook'
  | 'retry';

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Connection = {
  id: string;
  sourceId: string;
  targetId: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: 'standard' | 'conditional' | 'error';
};

export interface WorkflowNode {
  id: string;
  type: NodeType;
  category: NodeCategory;
  label: string;
  position: Position;
  size: Size;
  enabled: boolean;
  configuration: Record<string, any>;
  inputs?: string[];
  outputs?: string[];
  status?: 'idle' | 'running' | 'success' | 'error';
  testResult?: any;
}

export interface Workflow {
  id?: string;
  name?: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  nodes: WorkflowNode[];
  connections: Connection[];
  isActive?: boolean;
  lastRun?: string;
  runCount?: number;
}

export interface ExecutionLog {
  id: string;
  workflowId: string;
  nodeId: string;
  timestamp: string;
  status: 'start' | 'complete' | 'error';
  data?: any;
  error?: string;
  duration: number;
}

export interface SavedWorkflow {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  runCount: number;
  isActive: boolean;
}

export interface NodeDefinition {
  type: NodeType;
  category: NodeCategory;
  label: string;
  description: string;
  icon: string;
  inputsCount: number;
  outputsCount: number;
  configFields: NodeConfigField[];
  examples?: string[];
}

export type NodeConfigFieldType = 
  | 'text' 
  | 'number' 
  | 'select' 
  | 'boolean'
  | 'code'
  | 'textarea'
  | 'json'
  | 'date'
  | 'time'
  | 'datetime'
  | 'color'
  | 'file'
  | 'email'
  | 'url'
  | 'connection'
  | 'variable';

export interface NodeConfigField {
  name: string;
  label: string;
  type: NodeConfigFieldType;
  required?: boolean;
  default?: any;
  placeholder?: string;
  options?: Array<{value: string; label: string}>;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  validation?: RegExp;
  languageMode?: string;
}
