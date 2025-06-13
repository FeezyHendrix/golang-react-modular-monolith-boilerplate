
import { useCallback } from 'react';
import { OperatorData, Position } from '../types';

export function useOperatorMovement(operators: OperatorData[], onUpdateOperator: (op: OperatorData) => void) {
  const handleOperatorMove = useCallback((operatorId: string, newPosition: Position) => {
    const operator = operators.find(op => op.id === operatorId);
    if (operator) {
      onUpdateOperator({
        ...operator,
        position: newPosition
      });
    }
  }, [operators, onUpdateOperator]);

  return { handleOperatorMove }
}
