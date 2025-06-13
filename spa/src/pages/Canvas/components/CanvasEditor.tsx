
import React, { useState } from 'react';
import { CanvasState, Connection, OperatorData, Position } from '../types';
import OperatorNode from './OperatorNode';
import UnlinkConnectionDialog from './UnlinkConnectionDialog';
import { useCanvasTransform } from '../hooks/useCanvasTransform';
import { useConnectionDraft } from '../hooks/useConnectionDraft';
import { useOperatorMovement } from '../hooks/useOperatorMovement';
import CanvasControls from './canvas/CanvasControls';
import GridBackground from './canvas/GridBackground';
import CanvasConnections from './canvas/CanvasConnections';

interface CanvasEditorProps {
  canvasState: CanvasState;
  onSelectOperator: (operatorId: string | null) => void;
  onUpdateOperator: (operator: OperatorData) => void;
  onRemoveOperator: (operatorId: string) => void;
  onConnect: (connection: Connection) => void;
  onRemoveConnection: (connectionId: string) => void;
  onDrop: (event: React.DragEvent, position: Position) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  canvasState,
  onSelectOperator,
  onUpdateOperator,
  onRemoveOperator,
  onConnect,
  onRemoveConnection,
  onDrop
}) => {
  const {
    scale,
    setScale,
    position,
    setPosition,
    isDragging,
    dragStart,
    handleCanvasMouseDown,
    handleCanvasMouseMove: handleCanvasTransformMove,
    handleCanvasMouseUp,
    resetTransform
  } = useCanvasTransform();

  const {
    connectionDraft,
    setConnectionDraft,
    handleConnectionStart,
    handleConnectionCancel,
    handleCanvasMouseMove: handleConnectionMouseMove,
    canvasRef
  } = useConnectionDraft(onConnect, position, scale);

  const { handleOperatorMove } = useOperatorMovement(canvasState.operators, onUpdateOperator);

  // Added: state to track which connection is being "unlinked"
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);
  const [connectionToUnlink, setConnectionToUnlink] = useState<string | null>(null);

  // Merge mouse move handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    handleCanvasTransformMove(e);
    handleConnectionMouseMove(e);
  };

  // Handle drop from palette
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - position.x) / scale;
    const y = (e.clientY - rect.top - position.y) / scale;
    onDrop(e, { x, y });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleOpenUnlink = (connectionId: string) => {
    setConnectionToUnlink(connectionId);
    setUnlinkDialogOpen(true);
  };

  const handleCloseUnlink = () => {
    setUnlinkDialogOpen(false);
    setConnectionToUnlink(null);
  };

  const handleConfirmUnlink = () => {
    if (connectionToUnlink) {
      onRemoveConnection(connectionToUnlink);
    }
    handleCloseUnlink();
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div 
      className="w-full h-full overflow-hidden bg-gray-50 relative"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
      onWheel={(e) => {
        if (e.ctrlKey) {
          e.preventDefault();
          const delta = e.deltaY < 0 ? 0.1 : -0.1;
          setScale(prev => Math.min(Math.max(0.5, prev + delta), 2));
        }
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      ref={canvasRef}
      id="canvas-editor"
    >
      {/* Canvas controls */}
      <CanvasControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={resetTransform}
      />

      {/* Canvas content with transform */}
      <div
        className="w-full h-full"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          position: 'relative'
        }}
      >
        {/* Grid background */}
        <GridBackground />

        {/* Connection lines */}
        <CanvasConnections
          connections={canvasState.connections}
          operators={canvasState.operators}
          connectionDraft={connectionDraft}
          onOpenUnlink={handleOpenUnlink}
        />

        {/* Operator nodes */}
        {canvasState.operators.map(operator => (
          <OperatorNode
            key={operator.id}
            operator={operator}
            isSelected={operator.id === canvasState.selectedOperatorId}
            onSelect={() => onSelectOperator(operator.id)}
            onMove={(newPosition) => handleOperatorMove(operator.id, newPosition)}
            onRemove={() => onRemoveOperator(operator.id)}
            onConnectionStart={handleConnectionStart}
            onConnectionEnd={() => {}}
            onConnectionCancel={handleConnectionCancel}
          />
        ))}
      </div>
      {/* Unlink Connection dialog */}
      <UnlinkConnectionDialog
        open={unlinkDialogOpen}
        onClose={handleCloseUnlink}
        onConfirm={handleConfirmUnlink}
      />
    </div>
  );
};

export default CanvasEditor;
