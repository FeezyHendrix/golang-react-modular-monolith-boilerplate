
import { CanvasState, Connection, OperatorData, OperatorType, TableData } from '../types';

// Helper interface for the execution graph
interface ExecutionNode {
  id: string;
  type: OperatorType;
  incomingNodes: string[];
  outgoingNodes: string[];
  executed: boolean;
  data: TableData | null;
  error: string | null;
}

// Helper for building the execution graph
interface ExecutionGraph {
  [key: string]: ExecutionNode;
}

/**
 * Builds a directed graph from canvas operators and connections
 */
export function buildExecutionGraph(state: CanvasState): ExecutionGraph {
  const graph: ExecutionGraph = {};
  
  // Initialize graph with operators
  state.operators.forEach(operator => {
    graph[operator.id] = {
      id: operator.id,
      type: operator.type,
      incomingNodes: [],
      outgoingNodes: [],
      executed: false,
      data: null,
      error: null
    };
  });
  
  // Add connections to the graph
  state.connections.forEach(connection => {
    // Add source to target's incoming nodes
    if (graph[connection.targetId]) {
      graph[connection.targetId].incomingNodes.push(connection.sourceId);
    }
    
    // Add target to source's outgoing nodes
    if (graph[connection.sourceId]) {
      graph[connection.sourceId].outgoingNodes.push(connection.targetId);
    }
  });
  
  return graph;
}

/**
 * Performs topological sort on the execution graph to determine execution order
 */
export function getExecutionOrder(graph: ExecutionGraph): string[] {
  const visited: Set<string> = new Set();
  const temp: Set<string> = new Set();
  const order: string[] = [];
  
  // Helper function for DFS
  function visit(nodeId: string): void {
    // If we've already processed this node, skip
    if (visited.has(nodeId)) return;
    
    // Check for cycles
    if (temp.has(nodeId)) {
      throw new Error(`Cycle detected in operator graph with node: ${nodeId}`);
    }
    
    // Mark as temporarily visited for cycle detection
    temp.add(nodeId);
    
    // Visit all incoming nodes first
    const node = graph[nodeId];
    if (node) {
      node.incomingNodes.forEach(incomingId => {
        visit(incomingId);
      });
    }
    
    // Mark as visited and add to order
    temp.delete(nodeId);
    visited.add(nodeId);
    order.push(nodeId);
  }
  
  // Start DFS from each node that hasn't been visited
  Object.keys(graph).forEach(nodeId => {
    if (!visited.has(nodeId)) {
      visit(nodeId);
    }
  });
  
  // We need to reverse the order because we added nodes after all dependencies
  return order.reverse();
}

/**
 * Validates that an operator can be executed based on its inputs
 */
export function canExecuteOperator(operatorId: string, graph: ExecutionGraph): boolean {
  const node = graph[operatorId];
  if (!node) return false;
  
  // Check if all incoming nodes have been executed
  return node.incomingNodes.every(incomingId => {
    const incomingNode = graph[incomingId];
    return incomingNode && incomingNode.executed && incomingNode.data !== null;
  });
}

/**
 * Returns a list of all operators that need to be executed to evaluate the target operator
 */
export function getRequiredExecutionChain(targetId: string, graph: ExecutionGraph): string[] {
  // Get full execution order
  const fullOrder = getExecutionOrder(graph);
  
  // Determine which nodes are required for the target node
  const requiredNodes: Set<string> = new Set();
  
  function addDependencies(nodeId: string) {
    if (requiredNodes.has(nodeId)) return;
    
    requiredNodes.add(nodeId);
    
    // Add all dependencies
    const node = graph[nodeId];
    if (node) {
      node.incomingNodes.forEach(incomingId => {
        addDependencies(incomingId);
      });
    }
  }
  
  // Start with the target node's dependencies
  addDependencies(targetId);
  
  // Filter the full order to only include required nodes
  return fullOrder.filter(nodeId => requiredNodes.has(nodeId));
}

/**
 * Helper for debugging execution order
 */
export function logExecutionChain(chain: string[], graph: ExecutionGraph): void {
  console.log('Execution chain:');
  chain.forEach((nodeId, index) => {
    const node = graph[nodeId];
    console.log(`${index + 1}. ${node?.type} (${nodeId}) - Inputs: [${node?.incomingNodes.join(', ')}]`);
  });
}
