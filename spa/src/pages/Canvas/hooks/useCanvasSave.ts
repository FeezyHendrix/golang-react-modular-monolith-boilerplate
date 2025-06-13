
import { useCallback } from 'react';
import { CanvasState } from '../types';

export function useCanvasSave(canvasState: CanvasState, generatedSql: string, setCanvasState: (state: CanvasState) => void, setGeneratedSql: (sql: string) => void, setPreviewResults: (res: any) => void) {
  const saveCanvas = useCallback((name: string, description?: string) => {
    const savedCanvas = {
      id: `canvas-${Date.now()}`,
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      state: canvasState,
      generatedSql
    };

    const savedCanvases = JSON.parse(localStorage.getItem('savedCanvases') || '[]');
    localStorage.setItem('savedCanvases', JSON.stringify([...savedCanvases, savedCanvas]));
    return savedCanvas;
  }, [canvasState, generatedSql]);

  const loadCanvas = useCallback((canvasId: string) => {
    const savedCanvases = JSON.parse(localStorage.getItem('savedCanvases') || '[]');
    const canvas = savedCanvases.find((c: any) => c.id === canvasId);
    if (canvas) {
      setCanvasState(canvas.state);
      setGeneratedSql(canvas.generatedSql || '');
      setPreviewResults(null);
      return true;
    }
    return false;
  }, [setCanvasState, setGeneratedSql, setPreviewResults]);

  return { saveCanvas, loadCanvas };
}
