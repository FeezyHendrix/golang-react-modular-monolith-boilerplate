
// Re-export all types from their respective files
export type { Position, Size, CanvasState, Connection, ConnectionPoint, OperatorInput, OperatorOutput } from './common';

// Re-export all enums
export { 
  OperatorType, 
  OperatorStatus, 
  SortDirection, 
  AnalysisType, 
  SummaryLength 
} from './common';

// Export TableData and other interfaces needed
export type { TableData, WorkflowRunOptions, SavedWorkflow } from './common';

// Re-export specific operator types
export type { SourceOperatorData } from './source-operator';
export type { FilterOperatorData, FilterCondition } from './filter-operator';
export type { JoinOperatorData } from './join-operator';
export { JoinType } from './join-operator';
export type { AggregateOperatorData } from './aggregate-operator';
export { AggregateFunction } from './aggregate-operator';
export type { SelectOperatorData } from './select-operator';
export type { UnionOperatorData } from './union-operator';
export type { SortOperatorData } from './sort-operator';
export type { LimitOperatorData } from './limit-operator';
export type { AnalyzeTextOperatorData } from './analyze-operator';
export { TextAnalysisType, TextSummaryLength } from './analyze-operator';

// Define the condition interface properly to maintain compatibility
export type { Condition } from './common';

export interface Aggregation {
  field: string;
  function: string;
  alias?: string;
}

export type { SortField } from './common';

// Export the main OperatorData interface which is a union of various operator types
export type { OperatorData } from './common';
