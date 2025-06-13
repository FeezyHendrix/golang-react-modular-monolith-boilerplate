
import { useState, useCallback } from 'react';
import { CanvasState, OperatorType, TableData, OperatorData } from '../types';
import { buildExecutionGraph, getExecutionOrder } from '../utils/executionGraph';

export function useCanvasPreview() {
  const [previewResults, setPreviewResults] = useState<TableData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [resultsCache, setResultsCache] = useState<{ [operatorId: string]: TableData }>({});

  const clearResultsCache = useCallback(() => {
    setResultsCache({});
  }, []);

  // Mock implementation of operator execution functions
  const executeSourceOperator = useCallback(() => {
    return {
      columns: ['id', 'name', 'value'],
      rows: [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 }
      ]
    } as TableData;
  }, []);

  const executeFilterOperator = useCallback((input: TableData) => {
    // Simple implementation that returns the input
    return input;
  }, []);

  const executeJoinOperator = useCallback((left: TableData, right: TableData) => {
    // Simple implementation that returns the left input
    return left;
  }, []);

  const executeSelectOperator = useCallback((input: TableData) => {
    // Simple implementation that returns the input
    return input;
  }, []);
  
  const executeUnionOperator = useCallback((inputs: TableData[]) => {
    // Simple implementation that returns the first input
    return inputs[0] || { columns: [], rows: [] };
  }, []);
  
  const executeAggregateOperator = useCallback((input: TableData) => {
    // Simple implementation that returns the input
    return input;
  }, []);
  
  const executeSortOperator = useCallback((input: TableData) => {
    // Simple implementation that returns the input
    return input;
  }, []);
  
  const executeLimitOperator = useCallback((input: TableData) => {
    // Simple implementation that returns the input
    return input;
  }, []);
  
  const executeAnalyzeTextOperator = useCallback((input: TableData) => {
    // Simple implementation that returns the input with an additional sentiment column
    return {
      ...input,
      columns: [...input.columns, 'sentiment'],
      rows: input.rows.map(row => ({...row, sentiment: 'positive'}))
    };
  }, []);

  const executeOperatorById = useCallback(async (operatorId: string, state: CanvasState) => {
    const operator = state.operators.find(op => op.id === operatorId);
    if (!operator) return null;

    // Check cache
    if (resultsCache[operatorId]) {
      return resultsCache[operatorId];
    }

    try {
      let result: TableData;
      const incomingConnections = state.connections.filter(conn => conn.targetId === operatorId);
      const inputResults = await Promise.all(
        incomingConnections.map(conn => executeOperatorById(conn.sourceId, state))
      );

      switch (operator.type as OperatorType) {
        case 'source':
          result = executeSourceOperator();
          break;

        case 'filter':
          if (!inputResults[0]) throw new Error('Filter requires input data');
          result = executeFilterOperator(inputResults[0]);
          break;

        case 'join':
          if (inputResults.length < 2) throw new Error('Join requires two inputs');
          result = executeJoinOperator(inputResults[0], inputResults[1]);
          break;

        case 'select':
          if (!inputResults[0]) throw new Error('Select requires input data');
          result = executeSelectOperator(inputResults[0]);
          break;

        case 'union':
          if (inputResults.length < 2) throw new Error('Union requires multiple inputs');
          result = executeUnionOperator(inputResults);
          break;

        case 'aggregate':
          if (!inputResults[0]) throw new Error('Aggregate requires input data');
          result = executeAggregateOperator(inputResults[0]);
          break;

        case 'sort':
          if (!inputResults[0]) throw new Error('Sort requires input data');
          result = executeSortOperator(inputResults[0]);
          break;

        case 'limit':
          if (!inputResults[0]) throw new Error('Limit requires input data');
          result = executeLimitOperator(inputResults[0]);
          break;
          
        case 'analyze':
          if (!inputResults[0]) throw new Error('Analyze requires input data');
          result = executeAnalyzeTextOperator(inputResults[0]);
          break;

        default:
          throw new Error(`Unknown operator type: ${operator.type}`);
      }

      setResultsCache(prev => ({ ...prev, [operatorId]: result }));
      return result;
    } catch (error: any) {
      setExecutionError(error.message || 'Unknown error occurred');
      return null;
    }
  }, [
    resultsCache, 
    executeSourceOperator,
    executeFilterOperator,
    executeJoinOperator,
    executeSelectOperator,
    executeUnionOperator,
    executeAggregateOperator,
    executeSortOperator,
    executeLimitOperator,
    executeAnalyzeTextOperator
  ]);

  const executeQuery = useCallback(async (state: CanvasState) => {
    setIsLoading(true);
    setExecutionError(null);
    try {
      const graph = buildExecutionGraph(state);
      const executionOrder = getExecutionOrder(graph);
      if (executionOrder.length === 0) {
        throw new Error('No operators to execute');
      }
      const finalResult = await executeOperatorById(executionOrder[executionOrder.length - 1], state);
      setPreviewResults(finalResult);
    } catch (error: any) {
      setExecutionError(error.message || 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [executeOperatorById]);

  return {
    previewResults,
    isLoading,
    executeQuery,
    setPreviewResults,
    executeOperatorById,
    executionError,
    clearResultsCache
  };
}
