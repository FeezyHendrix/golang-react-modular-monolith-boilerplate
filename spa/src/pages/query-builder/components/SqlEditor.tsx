
import React from 'react';
import { validateSql } from '../utils/validationUtils';
import BaseCodeEditor from './common/BaseCodeEditor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

interface SqlEditorProps {
  sqlQuery: string;
  setSqlQuery: (sql: string) => void;
  onClose?: () => void;
  onAddData?: (columns: string[], data: any[], consoleOutput: string) => void;
}

const SqlEditor: React.FC<SqlEditorProps> = ({ 
  sqlQuery, 
  setSqlQuery, 
  onClose,
  onAddData 
}) => {
  // Function to generate mock data based on the SQL query
  const generateMockData = (query: string): any[] => {
    // Extract column names from the query (simplified approach)
    const columnsMatch = query.match(/SELECT\s+(.*?)\s+FROM/i);
    let columns = ['id', 'name', 'value', 'date'];
    
    if (columnsMatch && columnsMatch[1] !== '*') {
      columns = columnsMatch[1].split(',').map(col => {
        // Extract alias if present
        const parts = col.trim().split(/\s+as\s+/i);
        return parts.length > 1 ? parts[1].trim() : parts[0].trim();
      });
    }
    
    // Generate mock data
    return Array.from({ length: 120 }, (_, i) => {
      const row: Record<string, any> = {};
      columns.forEach(col => {
        if (col === 'id') row[col] = i + 1;
        else if (col.includes('date')) row[col] = new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0];
        else if (col.includes('name')) row[col] = `Item ${i + 1}`;
        else if (col.includes('count') || col.includes('sum') || col.includes('amount')) row[col] = Math.floor(Math.random() * 1000);
        else if (col.includes('percent') || col.includes('rate')) row[col] = (Math.random() * 100).toFixed(2) + '%';
        else row[col] = `Value for ${col} ${i + 1}`;
      });
      return row;
    });
  };

  // SQL execution function
  const executeQuery = async () => {
    // Simulate API call with setTimeout
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let output = "Executing SQL query...\n";
    output += `Query received: ${sqlQuery.split('\n')[0]}...\n`;
    output += "Connecting to database...\n";
    output += "Processing query...\n";
    
    // Mock data generation
    const mockData = generateMockData(sqlQuery);
    output += `Query executed successfully. Found ${mockData.length} rows.\n`;
    
    return {
      success: true,
      data: mockData,
      consoleOutput: output
    };
  };

  // Validation function that returns the expected format
  const validateCode = (code: string) => {
    const validationResult = validateSql(code);
    return {
      isValid: validationResult === "valid",
      error: validationResult === "valid" ? "" : validationResult
    };
  };

  return (
    <Card className="max-h-[90vh] flex flex-col">
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <BaseCodeEditor
            code={sqlQuery}
            setCode={setSqlQuery}
            language="sql"
            title=""
            placeholder="SELECT * FROM users WHERE status = 'active';"
            validateCode={validateCode}
            executeCode={executeQuery}
            onClose={onClose}
            onAddData={onAddData}
            hideGeneratedQuery={false}
            rows={6}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SqlEditor;
