
import { OperatorData, OperatorStatus, OperatorType } from './common';

// Define type for aggregation function
export enum AggregateFunction {
  SUM = 'SUM',
  AVG = 'AVG',
  MIN = 'MIN',
  MAX = 'MAX',
  COUNT = 'COUNT'
}

// Define type for aggregation
export interface Aggregation {
  field: string;
  function: string;
  alias?: string;
}

// Define interface for Aggregate operator
export interface AggregateOperatorData extends OperatorData {
  type: OperatorType.AGGREGATE;
  groupByFields?: string[];
  aggregations?: Aggregation[];
}
