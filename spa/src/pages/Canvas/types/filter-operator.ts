
import { OperatorData, OperatorStatus, OperatorType, Condition } from './common';

// Define type for filter condition
export type FilterCondition = Condition;

// Define interface for Filter operator
export interface FilterOperatorData extends OperatorData {
  type: OperatorType.FILTER;
  conditions: FilterCondition[];
}
