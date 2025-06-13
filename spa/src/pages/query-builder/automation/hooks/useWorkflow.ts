
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Workflow, 
  WorkflowNode, 
  NodeType, 
  NodeCategory, 
  Position, 
  Connection, 
  SavedWorkflow,
  ExecutionLog
} from '../types';
import { nodeDefinitions } from '../nodeDefinitions';

const initialWorkflow: Workflow = {
  nodes: [],
  connections: []
};

export function useWorkflow() {
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  
  // Load saved workflows from localStorage
  const loadSavedWorkflows = useCallback(() => {
    try {
      const savedString = localStorage.getItem('savedWorkflows');
      return savedString ? JSON.parse(savedString) : [];
    } catch (error) {
      console.error('Error loading saved workflows:', error);
      return [];
    }
  }, []);
  
  // Add a new node to the workflow
  const addNode = useCallback((type: NodeType, category: NodeCategory, position: Position) => {
    const definition = nodeDefinitions.find(d => d.type === type && d.category === category);
    
    if (!definition) {
      console.error(`No definition found for node type: ${type}`);
      return;
    }
    
    const newNode: WorkflowNode = {
      id: `node-${uuidv4()}`,
      type,
      category,
      label: definition.label,
      position,
      size: { width: 180, height: 80 },
      enabled: true,
      configuration: {},
      inputs: [],
      outputs: [],
      status: 'idle'
    };
    
    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
    
    // Select the new node
    setSelectedNode(newNode);
    
  }, []);
  
  // Update an existing node
  const updateNode = useCallback((updatedNode: WorkflowNode) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === updatedNode.id ? updatedNode : node
      )
    }));
    
    // Update selected node if it's the one being updated
    if (selectedNode && selectedNode.id === updatedNode.id) {
      setSelectedNode(updatedNode);
    }
  }, [selectedNode]);
  
  // Remove a node and its connections
  const removeNode = useCallback((nodeId: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(
        conn => conn.sourceId !== nodeId && conn.targetId !== nodeId
      )
    }));
    
    // Clear selected node if it's the one being removed
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);
  
  // Connect two nodes
  const connectNodes = useCallback((connection: Connection) => {
    const connectionId = `conn-${uuidv4()}`;
    
    setWorkflow(prev => ({
      ...prev,
      connections: [...prev.connections, { ...connection, id: connectionId }]
    }));
  }, []);
  
  // Remove a connection
  const removeConnection = useCallback((connectionId: string) => {
    setWorkflow(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId)
    }));
  }, []);
  
  // Select a node for editing
  const selectNode = useCallback((node: WorkflowNode | null) => {
    setSelectedNode(node);
  }, []);
  
  // Save workflow to localStorage
  const saveWorkflow = useCallback((name: string, description?: string, tags?: string[]) => {
    const savedWorkflows = loadSavedWorkflows();
    
    const workflowToSave: SavedWorkflow = {
      id: workflow.id || `workflow-${uuidv4()}`,
      name,
      description,
      tags: tags || [],
      createdAt: workflow.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastRun: workflow.lastRun,
      runCount: workflow.runCount || 0,
      isActive: true
    };
    
    // Save the workflow configuration to localStorage
    const savedWorkflowIndex = savedWorkflows.findIndex((w: SavedWorkflow) => w.id === workflowToSave.id);
    
    if (savedWorkflowIndex >= 0) {
      savedWorkflows[savedWorkflowIndex] = workflowToSave;
    } else {
      savedWorkflows.push(workflowToSave);
    }
    
    // Update full workflow details in separate storage
    localStorage.setItem('savedWorkflows', JSON.stringify(savedWorkflows));
    localStorage.setItem(`workflow-${workflowToSave.id}`, JSON.stringify({
      ...workflow,
      id: workflowToSave.id,
      name,
      description,
      tags: tags || [],
      createdAt: workflowToSave.createdAt,
      updatedAt: workflowToSave.updatedAt
    }));
    
    // Update current workflow with metadata
    setWorkflow(prev => ({
      ...prev,
      id: workflowToSave.id,
      name,
      description,
      tags: tags || [],
      createdAt: workflowToSave.createdAt,
      updatedAt: workflowToSave.updatedAt
    }));
    
    return workflowToSave;
  }, [workflow, loadSavedWorkflows]);
  
  // Load a workflow
  const loadWorkflow = useCallback((workflowId: string) => {
    try {
      const workflowString = localStorage.getItem(`workflow-${workflowId}`);
      if (workflowString) {
        const loadedWorkflow = JSON.parse(workflowString);
        setWorkflow(loadedWorkflow);
        setSelectedNode(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading workflow:', error);
      return false;
    }
  }, []);
  
  // Clear the current workflow
  const clearWorkflow = useCallback(() => {
    setWorkflow(initialWorkflow);
    setSelectedNode(null);
    setExecutionLogs([]);
  }, []);
  
  // Mock function to simulate running a workflow
  const runWorkflow = useCallback(async () => {
    if (workflow.nodes.length === 0) return;
    
    setIsRunning(true);
    setExecutionLogs([]);
    
    // Reset node statuses
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => ({ ...node, status: 'idle' }))
    }));
    
    // Find trigger nodes (entry points)
    const triggerNodes = workflow.nodes.filter(node => node.category === 'trigger');
    
    if (triggerNodes.length === 0) {
      // If no trigger nodes, use the first node as starting point
      const startNodes = [workflow.nodes[0]];
      
      // Process each starting node
      for (const startNode of startNodes) {
        try {
          await processNode(startNode.id);
        } catch (error) {
          console.error(`Error processing workflow starting with node ${startNode.id}:`, error);
        }
      }
    } else {
      // Process each trigger node
      for (const triggerNode of triggerNodes) {
        try {
          await processNode(triggerNode.id);
        } catch (error) {
          console.error(`Error processing workflow starting with trigger ${triggerNode.id}:`, error);
        }
      }
    }
    
    // Update workflow metadata
    const now = new Date().toISOString();
    setWorkflow(prev => ({
      ...prev,
      lastRun: now,
      runCount: (prev.runCount || 0) + 1,
      updatedAt: now
    }));
    
    setIsRunning(false);
    
    // Save updated workflow if it has an ID
    if (workflow.id) {
      const savedWorkflows = loadSavedWorkflows();
      const index = savedWorkflows.findIndex((w: SavedWorkflow) => w.id === workflow.id);
      if (index >= 0) {
        savedWorkflows[index] = {
          ...savedWorkflows[index],
          lastRun: now,
          runCount: (savedWorkflows[index].runCount || 0) + 1,
          updatedAt: now
        };
        localStorage.setItem('savedWorkflows', JSON.stringify(savedWorkflows));
      }
    }
    
  }, [workflow, loadSavedWorkflows]);
  
  // Process a single node and its downstream connections
  const processNode = useCallback(async (nodeId: string, inputData: any = {}) => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node || !node.enabled) return null;
    
    // Mark node as running
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => 
        n.id === nodeId ? { ...n, status: 'running' } : n
      )
    }));
    
    // Log execution start
    const startTime = Date.now();
    const logId = `log-${uuidv4()}`;
    const startLog: ExecutionLog = {
      id: logId,
      workflowId: workflow.id || '',
      nodeId,
      timestamp: new Date().toISOString(),
      status: 'start',
      duration: 0
    };
    
    setExecutionLogs(prev => [...prev, startLog]);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    try {
      // Mock node execution based on type
      const result = await mockExecuteNode(node, inputData);
      
      // Mark node as successful
      setWorkflow(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => 
          n.id === nodeId ? { ...n, status: 'success', testResult: result } : n
        )
      }));
      
      // Log successful completion
      const endTime = Date.now();
      const completeLog: ExecutionLog = {
        id: `log-${uuidv4()}`,
        workflowId: workflow.id || '',
        nodeId,
        timestamp: new Date().toISOString(),
        status: 'complete',
        data: result,
        duration: endTime - startTime
      };
      
      setExecutionLogs(prev => [...prev, completeLog]);
      
      // Process downstream nodes
      const connections = workflow.connections.filter(conn => conn.sourceId === nodeId);
      
      for (const connection of connections) {
        // If connection is conditional, check condition
        if (connection.type === 'conditional') {
          // For now, we just pass through all conditional connections
          // In a real implementation, evaluate the condition based on result
          await processNode(connection.targetId, result);
        } else {
          await processNode(connection.targetId, result);
        }
      }
      
      return result;
      
    } catch (error) {
      // Mark node as failed
      setWorkflow(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => 
          n.id === nodeId ? { ...n, status: 'error' } : n
        )
      }));
      
      // Log error
      const endTime = Date.now();
      const errorLog: ExecutionLog = {
        id: `log-${uuidv4()}`,
        workflowId: workflow.id || '',
        nodeId,
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        duration: endTime - startTime
      };
      
      setExecutionLogs(prev => [...prev, errorLog]);
      
      // Process error connections
      const errorConnections = workflow.connections.filter(
        conn => conn.sourceId === nodeId && conn.type === 'error'
      );
      
      for (const connection of errorConnections) {
        await processNode(connection.targetId, { error: error instanceof Error ? error.message : String(error) });
      }
      
      throw error;
    }
    
  }, [workflow]);
  
  // Run a single node for testing
  const runSingleNode = useCallback(async (nodeId: string, testData: any = {}) => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    try {
      // Mark node as running
      setWorkflow(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => 
          n.id === nodeId ? { ...n, status: 'running' } : n
        )
      }));
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      // Execute node
      const result = await mockExecuteNode(node, testData);
      
      // Mark node as successful with result
      setWorkflow(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => 
          n.id === nodeId ? { ...n, status: 'success', testResult: result } : n
        )
      }));
      
      return result;
    } catch (error) {
      // Mark node as failed
      setWorkflow(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => 
          n.id === nodeId ? { ...n, status: 'error', testResult: { error: error instanceof Error ? error.message : String(error) } } : n
        )
      }));
      
      throw error;
    }
  }, [workflow]);
  
  // Mock function to simulate node execution
  const mockExecuteNode = useCallback(async (node: WorkflowNode, inputData: any = {}) => {
    // This would be replaced with actual implementation for each node type
    switch (node.category) {
      case 'trigger':
        return { triggered: true, timestamp: new Date().toISOString() };
      
      case 'action':
        return { 
          success: true, 
          actionPerformed: node.type,
          timestamp: new Date().toISOString(),
          result: `Executed ${node.label} with ${Object.keys(node.configuration).length} parameters`
        };
      
      case 'data':
        return {
          processed: true,
          operation: node.type,
          rowsAffected: Math.floor(Math.random() * 100) + 1,
          sample: { id: 123, name: "Sample Data", value: Math.random() * 1000 }
        };
      
      case 'ai':
        return {
          analyzed: true,
          aiModel: "GPT-4",
          confidence: Math.random() * 100,
          result: `AI analysis for ${node.label} completed successfully`
        };
      
      case 'condition':
        // For conditions, we would evaluate the condition here
        return {
          evaluated: true,
          result: Math.random() > 0.5, // Random boolean for demo
          path: Math.random() > 0.5 ? "true" : "false"
        };
      
      case 'utility':
        return {
          executed: true,
          utility: node.type,
          timestamp: new Date().toISOString()
        };
      
      default:
        return { executed: true, nodeType: node.type };
    }
  }, []);
  
  return {
    workflow,
    selectedNode,
    isRunning,
    executionLogs,
    addNode,
    updateNode,
    removeNode,
    connectNodes,
    removeConnection,
    selectNode,
    runWorkflow,
    runSingleNode,
    saveWorkflow,
    loadWorkflow,
    clearWorkflow,
  };
}
