
import { OperatorData, OperatorStatus, OperatorType } from './common';

// Define interface for Union operator
export interface UnionOperatorData extends OperatorData {
  type: OperatorType.UNION;
  operatorIds?: string[];
  selectedColumns?: string[];
}
