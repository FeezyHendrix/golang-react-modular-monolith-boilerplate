
import { OperatorData, OperatorStatus, OperatorType } from './common';

// Define interface for Select operator
export interface SelectOperatorData extends OperatorData {
  type: OperatorType.SELECT;
  selectedColumns?: string[];
}
