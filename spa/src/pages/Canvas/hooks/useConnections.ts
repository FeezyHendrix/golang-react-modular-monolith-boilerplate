
import { useState, useCallback } from 'react';
import { Connection, CanvasState } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useConnections = () => {
  const { toast } = useToast();
  
  const connectOperators = useCallback((canvasState: CanvasState, connection: Connection) => {
    if (connection.sourceId === connection.targetId) {
      toast({ description: "Cannot connect an operator to itself" });
      return false;
    }

    const connectionExists = canvasState.connections.some(
      conn => conn.sourceId === connection.sourceId && conn.targetId === connection.targetId
    );

    if (connectionExists) {
      toast({ description: "Connection already exists" });
      return false;
    }

    const wouldCreateCycle = (source: string, target: string, visited = new Set<string>()): boolean => {
      if (source === target) return true;
      if (visited.has(target)) return false;
      
      visited.add(target);
      return canvasState.connections.some(conn => 
        conn.sourceId === target && wouldCreateCycle(source, conn.targetId, visited)
      );
    };

    if (wouldCreateCycle(connection.targetId, connection.sourceId)) {
      toast({ description: "Cannot create circular connections" });
      return false;
    }

    return true;
  }, [toast]);

  return {
    connectOperators
  };
};
