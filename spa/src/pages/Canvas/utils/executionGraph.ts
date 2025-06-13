
import { CanvasState, Connection, OperatorData, OperatorType } from '../types';

export interface ExecutionNode {
  id: string;
  type: OperatorType;
  incomingNodes: string[];
  outgoingNodes: string[];
  executed: boolean;
  data: any;
  error: string | null;
}

export interface ExecutionGraph {
  [key: string]: ExecutionNode;
}

export function buildExecutionGraph(state: CanvasState): ExecutionGraph {
  const graph: ExecutionGraph = {};
  
  // Initialize nodes
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
  
  // Add connections
  state.connections.forEach(connection => {
    if (graph[connection.targetId]) {
      graph[connection.targetId].incomingNodes.push(connection.sourceId);
    }
    if (graph[connection.sourceId]) {
      graph[connection.sourceId].outgoingNodes.push(connection.targetId);
    }
  });
  
  return graph;
}

export function getExecutionOrder(graph: ExecutionGraph): string[] {
  const visited = new Set<string>();
  const temp = new Set<string>();
  const order: string[] = [];
  
  function visit(nodeId: string) {
    if (visited.has(nodeId)) return;
    if (temp.has(nodeId)) {
      throw new Error(`Cycle detected in operator graph at node: ${nodeId}`);
    }
    
    temp.add(nodeId);
    const node = graph[nodeId];
    if (node) {
      node.incomingNodes.forEach(incomingId => {
        visit(incomingId);
      });
    }
    
    temp.delete(nodeId);
    visited.add(nodeId);
    order.push(nodeId);
  }
  
  Object.keys(graph).forEach(nodeId => {
    if (!visited.has(nodeId)) {
      visit(nodeId);
    }
  });
  
  return order.reverse();
}

export function getRequiredExecutionChain(targetId: string, graph: ExecutionGraph): string[] {
  const requiredNodes = new Set<string>();
  
  function addDependencies(nodeId: string) {
    if (requiredNodes.has(nodeId)) return;
    requiredNodes.add(nodeId);
    
    const node = graph[nodeId];
    if (node) {
      node.incomingNodes.forEach(incomingId => {
        addDependencies(incomingId);
      });
    }
  }
  
  addDependencies(targetId);
  return Array.from(requiredNodes);
}
