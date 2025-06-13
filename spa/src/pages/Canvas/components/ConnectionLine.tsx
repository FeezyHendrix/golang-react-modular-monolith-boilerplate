
import React from 'react';

interface ConnectionLineProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isDraft?: boolean;
  onClick?: () => void;
  onOpenUnlink?: () => void;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  isDraft = false,
  onClick,
  onOpenUnlink,
}) => {
  const dx = Math.abs(targetX - sourceX);
  const offsetX = Math.min(dx * 0.5, 100);

  const path = `
    M ${sourceX} ${sourceY}
    C ${sourceX + offsetX} ${sourceY},
      ${targetX - offsetX} ${targetY},
      ${targetX} ${targetY}
  `;

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isDraft) {
      e.preventDefault();
      onOpenUnlink?.();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isDraft) {
      e.preventDefault();
      onOpenUnlink?.();
    }
  };

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: isDraft ? 'none' : 'all',
        zIndex: 1,
      }}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
    >
      <defs>
        <marker
          id={`arrowhead-${id}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon 
            points="0 0, 10 3.5, 0 7" 
            fill={isDraft ? '#a3a3a3' : '#0ea5e9'} 
          />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={isDraft ? '#a3a3a3' : '#0ea5e9'}
        strokeWidth={3}
        strokeDasharray={isDraft ? '5,5' : 'none'}
        markerEnd={`url(#arrowhead-${id})`}
        className={!isDraft ? 'cursor-pointer transition-colors hover:stroke-primary' : ''}
        onClick={onClick}
      />
      {!isDraft && (
        <>
          <circle 
            cx={sourceX} 
            cy={sourceY} 
            r={5} 
            fill="#0ea5e9"
            className="transition-colors hover:fill-primary"
          />
          <circle 
            cx={targetX} 
            cy={targetY} 
            r={5} 
            fill="#0ea5e9"
            className="transition-colors hover:fill-primary"
          />
        </>
      )}
    </svg>
  );
};

export default ConnectionLine;
