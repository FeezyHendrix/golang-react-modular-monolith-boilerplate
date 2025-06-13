
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { OperatorData, Position, OperatorType, OperatorStatus } from '../../types';
import { defaultNodeSize } from './canvasStateTypes';

export function useOperatorManagement(
  updateState: (update: (prev: OperatorData[]) => OperatorData[]) => void,
  selectOperator: (operatorId: string) => void
) {
  const addOperator = useCallback((type: OperatorType, position: Position) => {
    let newOperator: OperatorData;
    const id = `${type}-${uuidv4().slice(0, 8)}`;

    switch (type) {
      case OperatorType.SOURCE:
        newOperator = {
          id,
          type,
          name: 'Source',
          position,
          size: { ...defaultNodeSize },
          status: OperatorStatus.IDLE
        };
        break;
        
      case OperatorType.FILTER:
        newOperator = {
          id,
          type,
          name: 'Filter',
          position,
          size: { ...defaultNodeSize },
          status: OperatorStatus.IDLE
        };
        break;
        
      case OperatorType.JOIN:
        newOperator = {
          id,
          type,
          name: 'Join',
          position,
          size: { ...defaultNodeSize },
          status: OperatorStatus.IDLE
        };
        break;
        
      case OperatorType.AGGREGATE:
        newOperator = {
          id,
          type,
          name: 'Aggregate',
          position,
          size: { ...defaultNodeSize },
          status: OperatorStatus.IDLE
        };
        break;
        
      case OperatorType.SORT:
        newOperator = {
          id,
          type,
          name: 'Sort',
          position,
          size: { ...defaultNodeSize },
          status: OperatorStatus.IDLE
        };
        break;

      case OperatorType.SELECT:
        newOperator = {
          id,
          type,
          name: 'Select',
          position,
          size: { ...defaultNodeSize },
          status: OperatorStatus.IDLE
        };
        break;

      case OperatorType.UNION:
        newOperator = {
          id,
          type,
          name: 'Union',
          position,
          size: { ...defaultNodeSize },
          status: OperatorStatus.IDLE
        };
        break;

      case OperatorType.LIMIT:
        newOperator = {
          id,
          type,
          name: 'Limit',
          position,
          size: { ...defaultNodeSize },
          status: OperatorStatus.IDLE
        };
        break;
      
      case OperatorType.TRANSFORMATION:
      case OperatorType.TRANSFORM:
        newOperator = {
          id,
          type,
          name: 'Transformation',
          position,
          size: { ...defaultNodeSize },
          status: OperatorStatus.IDLE
        };
        break;
      
      case OperatorType.ANALYZE:
        newOperator = {
          id,
          type,
          name: 'Analyze Text',
          position,
          size: { ...defaultNodeSize },
          status: OperatorStatus.IDLE
        };
        break;
      
      default:
        // For any other operator type, create a default operator with capitalized name
        const operatorTypeName = String(type);
        const operatorName = operatorTypeName.charAt(0).toUpperCase() + operatorTypeName.slice(1);
        newOperator = {
          id,
          type,
          name: operatorName,
          position,
          size: { ...defaultNodeSize },
          status: OperatorStatus.IDLE
        };
        break;
    }

    updateState(prev => [...prev, newOperator]);
    selectOperator(newOperator.id);
    return newOperator;
  }, [updateState, selectOperator]);

  const updateOperator = useCallback((updatedOperator: OperatorData) => {
    updateState(prev => prev.map(op =>
      op.id === updatedOperator.id ? updatedOperator : op
    ));
  }, [updateState]);

  const removeOperator = useCallback((operatorId: string) => {
    updateState(prev => prev.filter(op => op.id !== operatorId));
  }, [updateState]);

  return {
    addOperator,
    updateOperator,
    removeOperator
  };
}
