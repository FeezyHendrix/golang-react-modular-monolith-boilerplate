
import { useState, useCallback } from 'react';
import { CanvasState, OperatorData, Connection, Position, OperatorType } from '../types';
import { initialCanvasState } from './canvas/canvasStateTypes';
import { useOperatorManagement } from './canvas/useOperatorManagement';
import { useConnectionManagement } from './canvas/useConnectionManagement';

export function useCanvasState() {
  const [canvasState, setCanvasState] = useState<CanvasState>(initialCanvasState);

  // Helper function to update operators state
  const updateOperators = useCallback((update: (prev: OperatorData[]) => OperatorData[]) => {
    setCanvasState(prev => ({
      ...prev,
      operators: update(prev.operators)
    }));
  }, []);

  // Helper function to update connections state
  const updateConnections = useCallback((update: (prev: Connection[]) => Connection[]) => {
    setCanvasState(prev => ({
      ...prev,
      connections: update(prev.connections)
    }));
  }, []);

  // Select operator helper - use callback to prevent re-renders
  const selectOperator = useCallback((operatorId: string | null) => {
    setCanvasState(prev => {
      // Only update if the selection actually changed
      if (prev.selectedOperatorId === operatorId) {
        return prev;
      }
      return {
        ...prev,
        selectedOperatorId: operatorId
      };
    });
  }, []);

  // Use the operator management functionality
  const { 
    addOperator: baseAddOperator, 
    updateOperator, 
    removeOperator: baseRemoveOperator 
  } = useOperatorManagement(updateOperators, selectOperator);

  // Use the connection management functionality
  const { 
    connectOperators, 
    removeConnection 
  } = useConnectionManagement(updateConnections);

  // Extend removeOperator to also remove related connections
  const removeOperator = useCallback((operatorId: string) => {
    baseRemoveOperator(operatorId);
    updateConnections(prev => prev.filter(
      conn => conn.sourceId !== operatorId && conn.targetId !== operatorId
    ));
    // Use functional update to avoid stale state
    setCanvasState(prev => ({
      ...prev,
      selectedOperatorId: prev.selectedOperatorId === operatorId ? null : prev.selectedOperatorId
    }));
  }, [baseRemoveOperator, updateConnections]);

  const clearCanvas = useCallback(() => {
    setCanvasState(initialCanvasState);
  }, []);

  return {
    canvasState,
    setCanvasState,
    addOperator: baseAddOperator,
    updateOperator,
    removeOperator,
    selectOperator,
    connectOperators,
    removeConnection,
    clearCanvas,
  };
}
