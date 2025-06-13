
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SqlPreviewProps {
  sql: string;
}

const SqlPreview: React.FC<SqlPreviewProps> = ({ sql }) => {
  const [isFormatted, setIsFormatted] = useState(false);
  
  const formatSql = (sql: string): string => {
    if (!sql) return '';
    
    return sql
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*\(\s*/g, ' (')
      .replace(/\s*\)\s*/g, ') ')
      .replace(/\s*=\s*/g, ' = ')
      .replace(/\bSELECT\b/gi, '\nSELECT')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
      .replace(/\bHAVING\b/gi, '\nHAVING')
      .replace(/\bORDER BY\b/gi, '\nORDER BY')
      .replace(/\bLIMIT\b/gi, '\nLIMIT')
      .replace(/\bUNION\b/gi, '\nUNION')
      .replace(/\bJOIN\b/gi, '\nJOIN')
      .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
      .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
      .replace(/\bFULL JOIN\b/gi, '\nFULL JOIN')
      .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
      .replace(/\bON\b/gi, '\n  ON');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(sql);
    toast({
      title: 'SQL Copied',
      description: 'SQL query copied to clipboard'
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Last updated: {format(new Date(), 'MMM d, yyyy HH:mm:ss')}
          </p>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setIsFormatted(!isFormatted)}
          >
            {isFormatted ? 'Raw SQL' : 'Format SQL'}
          </Button>
          <Button 
            onClick={handleCopyToClipboard}
            disabled={!sql}
          >
            Copy to Clipboard
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-grow border bg-gray-900 text-gray-100 rounded-md p-4 font-mono overflow-auto">
        {sql ? (
          <pre className="whitespace-pre-wrap">{isFormatted ? formatSql(sql) : sql}</pre>
        ) : (
          <div className="text-gray-400">
            No SQL generated yet. Add operators to the canvas to generate SQL.
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default SqlPreview;
