
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useCanvasState } from './useCanvasState';
import { useCanvasSql } from './useCanvasSql';
import { useCanvasPreview } from './useCanvasPreview';
import { OperatorData, OperatorType, Position, SavedWorkflow, TableData, OperatorStatus } from '../types';

export const useCanvas = () => {
  const { toast } = useToast();
  const [executionError, setExecutionError] = useState<string | null>(null);
  const {
    canvasState,
    setCanvasState,
    addOperator,
    updateOperator,
    removeOperator,
    selectOperator: originalSelectOperator,
    connectOperators,
    removeConnection,
    clearCanvas: originalClearCanvas,
  } = useCanvasState();

  const { generatedSql, generateSql } = useCanvasSql(canvasState);
  const { 
    previewResults, 
    isLoading, 
    executeQuery, 
    setPreviewResults, 
    executeOperatorById, 
    executionError: previewExecutionError,
    clearResultsCache 
  } = useCanvasPreview();

  // Override selectOperator to clear error when deselecting
  const selectOperator = useCallback((operatorId: string | null) => {
    originalSelectOperator(operatorId);
    
    // Clear error when operator is deselected
    if (!operatorId) {
      setExecutionError(null);
    } else {
      // Check if operator is properly configured, if so, clear specific errors
      const operator = canvasState.operators.find(op => op.id === operatorId);
      if (operator?.status === OperatorStatus.CONFIGURED) {
        // Clear specific errors if they exist and the operator is properly configured
        if (executionError?.includes("Join keys are not defined") && operator.type === "join") {
          setExecutionError(null);
        }
      }
    }
  }, [originalSelectOperator, canvasState.operators, executionError]);

  // Override clearCanvas to also clear errors
  const clearCanvas = useCallback(() => {
    originalClearCanvas();
    setExecutionError(null);
  }, [originalClearCanvas]);
  
  // Improved error handling - we should clear specific errors when operators get configured
  const modifiedUpdateOperator = useCallback((updatedOperator: OperatorData) => {
    // If operator is now configured and we have an error that relates to its configuration, clear it
    if (updatedOperator.status === OperatorStatus.CONFIGURED) {
      if (executionError?.includes("Join keys are not defined") && updatedOperator.type === "join") {
        setExecutionError(null);
      }
    }
    
    updateOperator(updatedOperator);
  }, [updateOperator, executionError]);
  
  // Update any execution errors from preview
  useEffect(() => {
    if (previewExecutionError) {
      // Only set execution error if we don't have a false positive from a configured operator
      const hasConfiguredJoin = canvasState.operators.some(
        op => op.type === 'join' && op.status === OperatorStatus.CONFIGURED
      );
      
      if (previewExecutionError.includes("Join keys are not defined") && hasConfiguredJoin) {
        // Don't set the error if we have a properly configured join operator
        return;
      }
      
      setExecutionError(previewExecutionError);
    }
  }, [previewExecutionError, canvasState.operators]);

  // When selecting an operator, execute it to get up-to-date preview
  useEffect(() => {
    const selectedOp = canvasState.operators.find(op => op.id === canvasState.selectedOperatorId);
    
    if (selectedOp) {
      // Execute the selected operator to get its output
      executeOperatorById(selectedOp.id, canvasState).then(result => {
        if (result) {
          // Update preview results with this operator's output
          setPreviewResults(result);
        }
      });
    }
  }, [canvasState.selectedOperatorId, executeOperatorById, setPreviewResults, canvasState]);

  // Override addOperator to set initial status to UNCONFIGURED
  const addOperatorWithStatus = useCallback((type: OperatorType, position: Position) => {
    const newOperator = addOperator(type, position);
    return newOperator;
  }, [addOperator]);

  // Helper function to get available columns for an operator
  const getAvailableColumns = useCallback((operatorId: string): string[] => {
    // Implementation would depend on your data model
    // This is a simple placeholder implementation
    return [];
  }, []);

  return {
    canvasState,
    selectedOperator: canvasState.operators.find(op => op.id === canvasState.selectedOperatorId) || null,
    generatedSql,
    previewResults,
    isLoading,
    executionError,
    addOperator: addOperatorWithStatus,
    updateOperator: modifiedUpdateOperator,
    removeOperator,
    selectOperator,
    connectOperators,
    removeConnection,
    generateSql,
    executeQuery,
    clearCanvas,
    getAvailableColumns,
    setCanvasState,
    saveCanvas: useCallback((name: string, description?: string) => {
      const savedCanvas: SavedWorkflow = {
        id: `canvas-${Date.now()}`,
        name,
        description: description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        canvasState,
        generatedSql
      };
  
      const savedCanvases = JSON.parse(localStorage.getItem('savedCanvases') || '[]');
      localStorage.setItem('savedCanvases', JSON.stringify([...savedCanvases, savedCanvas]));
      toast({
        title: "Canvas saved",
        description: `"${name}" saved successfully.`
      });
      return savedCanvas;
    }, [canvasState, generatedSql, toast]),
    loadCanvas: useCallback((canvasId: string) => {
      try {
        const savedCanvases = JSON.parse(localStorage.getItem('savedCanvases') || '[]');
        const canvas = savedCanvases.find((c: SavedWorkflow) => c.id === canvasId);
        if (canvas) {
          setCanvasState(canvas.canvasState);
          setPreviewResults(null);
          clearResultsCache(); // Clear cached results when loading a new canvas
          setExecutionError(null); // Clear any existing errors
          toast({
            title: "Canvas loaded",
            description: `"${canvas.name}" loaded successfully.`
          });
          return true;
        }
        toast({
          title: "Error",
          description: "Failed to load canvas.",
          variant: "destructive"
        });
        return false;
      } catch (error) {
        console.error('Error loading canvas:', error);
        toast({
          title: "Error",
          description: "Failed to load canvas due to an error.",
          variant: "destructive"
        });
        return false;
      }
    }, [setCanvasState, setPreviewResults, clearResultsCache, toast])
  };
};
