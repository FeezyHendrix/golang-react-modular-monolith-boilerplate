
import React from 'react';
import BaseCodeEditor from './common/BaseCodeEditor';
import { validatePython } from '../utils/validationUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

interface PythonEditorProps {
  pythonCode: string;
  setPythonCode: (code: string) => void;
  onClose?: () => void;
  onAddData?: (columns: string[], data: any[], consoleOutput: string) => void;
}

const PythonEditor: React.FC<PythonEditorProps> = ({
  pythonCode,
  setPythonCode,
  onClose,
  onAddData
}) => {
  // Mock execution function
  const executePython = async () => {
    // Simulate API call with setTimeout
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const output = "Executing Python script...\n" +
      "Setting up Python environment...\n" +
      "Running script...\n" +
      "Script executed successfully.\n";
    
    // Mock data generation
    const mockData = generateMockDataFromPython();
    
    return {
      success: true,
      data: mockData,
      consoleOutput: output
    };
  };
  
  // Function to generate mock data 
  const generateMockDataFromPython = () => {
    // Generate 100 rows of random data
    return Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      value: Math.round(Math.random() * 1000) / 10,
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));
  };
  
  // Function to get code template
  const getTemplate = () => {
    return `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Read your data
df = pd.read_csv('data.csv')

# Display the first 5 rows
print(df.head())

# Basic statistics
print(df.describe())

# Return the dataframe for display
return df`;
  };
  
  // Validation function that returns the expected format
  const validateCode = (code: string) => {
    const validationResult = validatePython(code);
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
            code={pythonCode}
            setCode={setPythonCode}
            language="python"
            title=""
            placeholder="# Write your Python code here"
            validateCode={validateCode}
            executeCode={executePython}
            getCodeTemplate={getTemplate}
            onClose={onClose}
            onAddData={onAddData}
            hideGeneratedQuery={true}
            rows={6}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PythonEditor;
