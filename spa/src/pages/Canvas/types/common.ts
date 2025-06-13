
export interface OperatorData {
  id: string;
  type: OperatorType;
  name: string;
  position: Position;
  size: Size;
  status: OperatorStatus;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface CanvasState {
  operators: OperatorData[];
  connections: Connection[];
  selectedOperatorId: string | null;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourcePortId: string;
  targetPortId: string;
}

export interface ConnectionPoint {
  operatorId: string;
  portId: string;
}

export interface OperatorInput {
  id: string;
  name: string;
  type: string;
}

export interface OperatorOutput {
  id: string;
  name: string;
  type: string;
}

export enum OperatorType {
  SOURCE = 'source',
  FILTER = 'filter',
  JOIN = 'join',
  AGGREGATE = 'aggregate',
  SELECT = 'select',
  UNION = 'union',
  SORT = 'sort',
  LIMIT = 'limit',
  TRANSFORMATION = 'transformation',
  TRANSFORM = 'transform',
  ANALYZE = 'analyze'
}

export enum OperatorStatus {
  IDLE = 'idle',
  CONFIGURED = 'configured',
  RUNNING = 'running',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  NEW = 'new',
  UNCONFIGURED = 'unconfigured'
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface TableData {
  name?: string; // Made optional to fix all the TS errors
  columns: string[];
  rows: any[];
}

export interface WorkflowRunOptions {
  saveResults?: boolean;
  resultDestination?: string;
  outputName?: string;
}

export interface SavedWorkflow {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  canvasState: CanvasState;
  generatedSql?: string;
}

export enum AnalysisType {
  SENTIMENT = "sentiment",
  LANGUAGE = "language",
  ENTITIES = "entities",
  KEYWORDS = "keywords",
  SUMMARY = "summary",
  ENTITY = "entity",
  KEYWORD = "keyword"
}

export enum SummaryLength {
  SHORT = "short",
  MEDIUM = "medium", 
  DETAILED = "detailed"
}

// Define the condition interface properly
export interface Condition {
  field: string;
  operator: string;
  value: string | number | boolean;
}

export interface SortField {
  field: string;
  direction: SortDirection;
}
