
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Connection } from '../../types';

export function useConnectionManagement(
  updateConnections: (update: (prev: Connection[]) => Connection[]) => void
) {
  const connectOperators = useCallback((connection: Connection) => {
    updateConnections(prev => {
      const connectionExists = prev.some(
        conn => conn.sourceId === connection.sourceId && conn.targetId === connection.targetId
      );
      if (connectionExists) return prev;
      const newConnection = {
        ...connection,
        id: `conn-${uuidv4().slice(0, 8)}`
      };
      return [...prev, newConnection];
    });
  }, [updateConnections]);

  const removeConnection = useCallback((connectionId: string) => {
    updateConnections(prev => prev.filter(conn => conn.id !== connectionId));
  }, [updateConnections]);

  return {
    connectOperators,
    removeConnection
  };
}
