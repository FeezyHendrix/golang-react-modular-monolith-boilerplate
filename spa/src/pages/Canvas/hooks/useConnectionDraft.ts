
import { useState, useCallback, useRef, useEffect } from 'react';

interface ConnectionDraft {
  sourceId: string;
  sourceHandle?: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function useConnectionDraft(onConnect: any, position: { x: number, y: number }, scale: number) {
  const [connectionDraft, setConnectionDraft] = useState<ConnectionDraft | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle mouse up for connection end
  const handleConnectionMouseUp = useCallback((e: MouseEvent) => {
    if (!connectionDraft) return;
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const targetNodeElement = elements.find(el =>
      el.hasAttribute('data-node-id') &&
      el.getAttribute('data-node-id') !== connectionDraft.sourceId
    );
    if (targetNodeElement) {
      const targetNodeId = targetNodeElement.getAttribute('data-node-id');
      if (targetNodeId && targetNodeId !== connectionDraft.sourceId) {
        onConnect({
          id: `conn-${Date.now()}`,
          sourceId: connectionDraft.sourceId,
          targetId: targetNodeId,
          sourceHandle: connectionDraft.sourceHandle,
          targetHandle: undefined
        });
      }
    }
    setConnectionDraft(null);
  }, [connectionDraft, onConnect]);

  useEffect(() => {
    if (connectionDraft) {
      document.addEventListener('mouseup', handleConnectionMouseUp);
    }
    return () => {
      document.removeEventListener('mouseup', handleConnectionMouseUp);
    };
  }, [connectionDraft, handleConnectionMouseUp]);

  const handleConnectionStart = useCallback((
    sourceId: string, 
    sourceHandle: string | undefined,
    x: number, 
    y: number
  ) => {
    setConnectionDraft({
      sourceId,
      sourceHandle,
      startX: x,
      startY: y,
      endX: x,
      endY: y
    });
  }, []);

  const handleConnectionCancel = useCallback(() => {
    setConnectionDraft(null);
  }, []);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (connectionDraft && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / scale;
      const y = (e.clientY - rect.top - position.y) / scale;
      setConnectionDraft(prev =>
        prev ? { ...prev, endX: x, endY: y } : null
      );
    }
  }, [connectionDraft, position, scale]);

  return {
    connectionDraft,
    setConnectionDraft,
    handleConnectionStart,
    handleConnectionCancel,
    handleCanvasMouseMove,
    canvasRef
  };
}
