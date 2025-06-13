
import React from 'react';
import { Connection, OperatorData } from '../../types';
import ConnectionLine from '../ConnectionLine';

interface CanvasConnectionsProps {
  connections: Connection[];
  operators: OperatorData[];
  onOpenUnlink: (connectionId: string) => void;
  connectionDraft?: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null;
}

const CanvasConnections: React.FC<CanvasConnectionsProps> = ({
  connections,
  operators,
  onOpenUnlink,
  connectionDraft
}) => {
  return (
    <>
      {/* Connection lines */}
      {connections.map(connection => {
        const source = operators.find(op => op.id === connection.sourceId);
        const target = operators.find(op => op.id === connection.targetId);
        if (!source || !target) return null;
        const sourceX = source.position.x + source.size.width;
        const sourceY = source.position.y + source.size.height / 2;
        const targetX = target.position.x;
        const targetY = target.position.y + target.size.height / 2;
        return (
          <ConnectionLine
            key={connection.id}
            id={connection.id}
            sourceX={sourceX}
            sourceY={sourceY}
            targetX={targetX}
            targetY={targetY}
            onOpenUnlink={() => onOpenUnlink(connection.id)}
          />
        );
      })}

      {/* Draft connection line while drawing */}
      {connectionDraft && (
        <ConnectionLine
          id="draft"
          sourceX={connectionDraft.startX}
          sourceY={connectionDraft.startY}
          targetX={connectionDraft.endX}
          targetY={connectionDraft.endY}
          isDraft
        />
      )}
    </>
  );
};

export default CanvasConnections;
