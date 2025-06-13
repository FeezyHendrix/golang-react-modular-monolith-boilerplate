
import React, { memo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import OperatorPalette from './OperatorPalette';
import CanvasEditor from './CanvasEditor';
import ConfigPanel from './ConfigPanel';
import { OperatorData, Position, CanvasState, Connection, OperatorType } from '../types';

interface CanvasContentProps {
  canvasState: CanvasState;
  selectedOperator: OperatorData | null;
  onSelectOperator: (operator: OperatorData | null) => void;
  onUpdateOperator: (operator: OperatorData) => void;
  onRemoveOperator: (operatorId: string) => void;
  onConnect: (connection: Connection) => void;
  onRemoveConnection: (connectionId: string) => void;
  onDrop: (e: React.DragEvent, position: Position) => void;
  onAddOperator: (type: OperatorType, position: Position) => void;
  getAvailableColumns: (operatorId: string) => string[];
}

// Memoize the CanvasContent component to prevent unnecessary re-renders
const CanvasContent: React.FC<CanvasContentProps> = memo(({
  canvasState,
  selectedOperator,
  onSelectOperator,
  onUpdateOperator,
  onRemoveOperator,
  onConnect,
  onRemoveConnection,
  onDrop,
  onAddOperator,
  getAvailableColumns,
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full">
        <OperatorPalette onAddOperator={onAddOperator} />

        <CanvasEditor
          canvasState={canvasState}
          onSelectOperator={(operatorId) => {
            const operator = canvasState.operators.find(op => op.id === operatorId);
            onSelectOperator(operator || null);
          }}
          onUpdateOperator={onUpdateOperator}
          onRemoveOperator={onRemoveOperator}
          onConnect={(connection) => onConnect(connection)}
          onRemoveConnection={onRemoveConnection}
          onDrop={onDrop}
        />

        {selectedOperator && (
          <ConfigPanel
            operator={selectedOperator}
            updateOperator={onUpdateOperator}
            onClose={() => onSelectOperator(null)}
            connectedOperators={canvasState.operators}
            getAvailableColumns={getAvailableColumns}
          />
        )}
      </div>
    </DndProvider>
  );
});

// Add a display name
CanvasContent.displayName = 'CanvasContent';

export default CanvasContent;
