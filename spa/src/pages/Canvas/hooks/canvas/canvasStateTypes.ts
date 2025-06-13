
import { CanvasState, OperatorData, Connection, Position, OperatorType, OperatorStatus, Size } from '../../types';

export const initialCanvasState: CanvasState = {
  operators: [],
  connections: [],
  selectedOperatorId: null
};

// Default node size
export const defaultNodeSize: Size = { width: 180, height: 130 };
