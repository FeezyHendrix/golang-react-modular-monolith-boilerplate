
import { OperatorData, OperatorStatus, OperatorType } from './common';

// Define JoinType enum for join operations
export enum JoinType {
  INNER = 'INNER',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  FULL = 'FULL'
}

// Define interface for Join operator
export interface JoinOperatorData extends OperatorData {
  type: OperatorType.JOIN;
  leftOperatorId?: string;
  rightOperatorId?: string;
  leftKey?: string;
  rightKey?: string;
  joinType?: string;
}
