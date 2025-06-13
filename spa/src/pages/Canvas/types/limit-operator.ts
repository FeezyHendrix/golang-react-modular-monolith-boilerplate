
import { OperatorData, OperatorStatus, OperatorType } from './common';

// Define interface for Limit operator
export interface LimitOperatorData extends OperatorData {
  type: OperatorType.LIMIT;
  limit: number;
  direction?: 'top' | 'bottom';
}
