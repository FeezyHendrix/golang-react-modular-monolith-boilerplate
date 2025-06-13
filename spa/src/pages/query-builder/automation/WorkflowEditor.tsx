
import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Workflow, WorkflowNode, Position } from './types';
import WorkflowNodeComponent from './WorkflowNodeComponent';

// Register custom node types
const nodeTypes = {
  workflowNode: WorkflowNodeComponent
};

interface WorkflowEditorProps {
  workflow: Workflow;
  onSelectNode: (node: WorkflowNode | null) => void;
  onUpdateNode: (node: WorkflowNode) => void;
  onRemoveNode: (nodeId: string) => void;
  onConnect: (connection: any) => void;
  onRemoveConnection: (connectionId: string) => void;
  onDrop: (e: React.DragEvent, position: Position) => void;
  isRunning: boolean;
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  workflow,
  onSelectNode,
  onUpdateNode,
  onRemoveNode,
  onConnect,
  onRemoveConnection,
  onDrop,
  isRunning
}) => {
  // Convert workflow model to ReactFlow nodes and edges
  const workflowToReactFlow = useCallback((workflow: Workflow) => {
    // Convert nodes
    const rfNodes = workflow.nodes.map(node => ({
      id: node.id,
      type: 'workflowNode',
      position: node.position,
      data: {
        ...node,
        onClick: () => onSelectNode(node),
        onRemove: () => onRemoveNode(node.id)
      },
      draggable: !isRunning,
      selectable: !isRunning
    }));

    // Convert connections to edges
    const rfEdges = workflow.connections.map(conn => {
      let edgeType = ConnectionLineType.Bezier;
      let style = {};
      let markerEnd = { type: MarkerType.ArrowClosed };
      
      if (conn.type === 'conditional') {
        style = { stroke: '#f59e0b' }; // Yellow for conditional
      } else if (conn.type === 'error') {
        style = { stroke: '#ef4444' }; // Red for error
      } else {
        style = { stroke: '#10b981' }; // Green for standard
      }
      
      return {
        id: conn.id,
        source: conn.sourceId,
        target: conn.targetId,
        sourceHandle: conn.sourceHandle,
        targetHandle: conn.targetHandle,
        type: edgeType,
        markerEnd,
        style,
        animated: true,
        data: {
          type: conn.type || 'standard',
          onDelete: () => onRemoveConnection(conn.id)
        }
      };
    });
    
    return { nodes: rfNodes, edges: rfEdges };
  }, [isRunning, onRemoveConnection, onRemoveNode, onSelectNode]);
  
  const { nodes: initialNodes, edges: initialEdges } = workflowToReactFlow(workflow);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Update ReactFlow when the workflow changes
  React.useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = workflowToReactFlow(workflow);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [workflow, workflowToReactFlow, setNodes, setEdges]);
  
  // Handle node movement
  const onNodeDragStop = (_: any, node: any) => {
    const workflowNode = workflow.nodes.find(n => n.id === node.id);
    if (workflowNode) {
      onUpdateNode({
        ...workflowNode,
        position: node.position
      });
    }
  };
  
  // Handle connecting nodes
  const handleConnect = (params: Connection) => {
    onConnect({
      sourceId: params.source || '',
      targetId: params.target || '',
      sourceHandle: params.sourceHandle,
      targetHandle: params.targetHandle,
      type: 'standard'
    });
  };
  
  // Handle edge removal
  const onEdgeClick = (_: React.MouseEvent, edge: Edge) => {
    if (isRunning) return; // Prevent changes while workflow is running
    onRemoveConnection(edge.id);
  };
  
  // Handle canvas drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const reactFlowBounds = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - reactFlowBounds.left,
      y: e.clientY - reactFlowBounds.top
    };
    
    onDrop(e, position);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  return (
    <ReactFlowProvider>
      <div className="h-[600px] border rounded-md">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onNodeDragStop={onNodeDragStop}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.Bezier}
          defaultEdgeOptions={{
            type: ConnectionLineType.Bezier,
            markerEnd: { type: MarkerType.ArrowClosed },
            animated: true
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          fitView
        >
          <Panel position="top-left" className="bg-background p-2 rounded-md shadow-sm">
            <div className="text-sm font-medium">
              {isRunning ? (
                <span className="text-yellow-500 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                  Running workflow...
                </span>
              ) : workflow.nodes.length === 0 ? (
                <span className="text-muted-foreground">
                  Drag nodes from the left panel to build your workflow
                </span>
              ) : (
                <span className="text-primary">
                  {workflow.name || 'Untitled Workflow'} - {workflow.nodes.length} nodes
                </span>
              )}
            </div>
          </Panel>
          <Background />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const data = node.data as WorkflowNode;
              switch(data.category) {
                case 'trigger': return '#8b5cf6'; // Purple
                case 'action': return '#3b82f6'; // Blue
                case 'data': return '#10b981'; // Green
                case 'ai': return '#f59e0b'; // Yellow
                case 'condition': return '#ef4444'; // Red
                case 'utility': return '#6b7280'; // Gray
                default: return '#94a3b8'; // Slate
              }
            }}
          />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowEditor;
