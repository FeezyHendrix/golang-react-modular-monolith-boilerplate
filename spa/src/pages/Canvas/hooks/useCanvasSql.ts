
import { useState, useEffect, useCallback } from 'react';
import { CanvasState } from '../types';
import { generateSqlFromState } from '../utils/sqlGenerator';

export function useCanvasSql(canvasState: CanvasState) {
  const [generatedSql, setGeneratedSql] = useState<string>('');

  useEffect(() => {
    if (canvasState.operators.length > 0) {
      try {
        setGeneratedSql(generateSqlFromState(canvasState));
      } catch (error) {
        console.error('Error generating SQL:', error);
        setGeneratedSql('');
      }
    } else {
      setGeneratedSql('');
    }
  }, [canvasState]);

  const generateSql = useCallback(() => {
    try {
      const sql = generateSqlFromState(canvasState);
      setGeneratedSql(sql);
      return sql;
    } catch (error) {
      console.error('Error generating SQL:', error);
      return '';
    }
  }, [canvasState]);

  return { generatedSql, generateSql };
}
