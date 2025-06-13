
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import ResultsDisplay from '../ResultsDisplay';
import CodeEditor from './CodeEditor';
import ResultsPagination from './ResultsPagination';

export interface BaseCodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: "sql" | "python";
  title: string;
  placeholder?: string;
  validateCode: (code: string) => string | null;
  executeCode: () => Promise<{
    success: boolean;
    data?: any[];
    consoleOutput: string;
    chartImage?: string;
  }>;
  onClose?: () => void;
  onAddData?: (columns: string[], data: any[], consoleOutput: string) => void;
  hideGeneratedQuery?: boolean;
}

const BaseCodeEditor: React.FC<BaseCodeEditorProps> = ({
  code,
  setCode,
  language,
  title,
  placeholder,
  validateCode,
  executeCode,
  onClose,
  onAddData,
  hideGeneratedQuery = false
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [chartImage, setChartImage] = useState<string>("");
  const itemsPerPage = 10;
  const { toast } = useToast();

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    // Clear validation errors when editing
    if (validationError) setValidationError(null);
  };

  // Function to execute the code
  const handleExecute = async () => {
    const error = validateCode(code);
    setValidationError(error);
    
    if (error) {
      toast({ 
        title: `${language === 'sql' ? 'SQL' : 'Python'} Error`, 
        description: error, 
        variant: "destructive" 
      });
      return;
    }

    setIsExecuting(true);
    setConsoleOutput("");
    
    try {
      const result = await executeCode();
      
      if (result.success && result.data) {
        // Limit to top 100 results
        const limitedData = result.data.slice(0, 100);
        setResults(limitedData);
        
        setTotalPages(Math.ceil(limitedData.length / itemsPerPage));
        setCurrentPage(1);
        
        setConsoleOutput(result.consoleOutput);
        
        if (result.chartImage) {
          setChartImage(result.chartImage);
        }
      } else {
        setConsoleOutput(result.consoleOutput);
      }
      
      toast({ 
        title: "Success", 
        description: `${language === 'sql' ? 'Query' : 'Code'} executed successfully` 
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : `Failed to execute ${language === 'sql' ? 'query' : 'code'}`;
      setConsoleOutput(`Error: ${errorMsg}`);
      
      toast({ 
        title: "Error", 
        description: errorMsg, 
        variant: "destructive" 
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Function to add data to source operator
  const handleAddData = () => {
    if (!results || results.length === 0) return;
    
    const columns = Object.keys(results[0]);
    if (onAddData) {
      onAddData(columns, results, consoleOutput);
      
      toast({ 
        title: "Data Added", 
        description: `${columns.length} columns have been added to Data Source` 
      });
    }
  };

  // Get current page of results
  const getCurrentPageResults = () => {
    if (!results) return [];
    const startIdx = (currentPage - 1) * itemsPerPage;
    return results.slice(startIdx, startIdx + itemsPerPage);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-4xl h-[85vh] flex flex-col overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()} // Prevent closing when clicking outside
      >
        <DialogHeader className="flex justify-between items-center flex-row">
          <DialogTitle>{title}</DialogTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{language === 'sql' ? 'SQL Query' : 'Python Script'}</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                language={language}
                placeholder={placeholder}
                validationError={validationError}
                rows={6}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button 
                  onClick={handleExecute} 
                  disabled={isExecuting} 
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    `Run ${language === 'sql' ? 'Query' : 'Script'}`
                  )}
                </Button>
                {results && results.length > 0 && (
                  <Button 
                    onClick={handleAddData} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Data
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </CardFooter>
          </Card>

          {language === 'python' && consoleOutput && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Console Output</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm font-mono bg-black text-green-400 p-4 rounded-md overflow-auto max-h-40">
                  {consoleOutput}
                </pre>
              </CardContent>
            </Card>
          )}
          
          {results && (
            <div className="flex-1 overflow-auto">
              <ResultsDisplay 
                data={getCurrentPageResults()}
                consoleOutput={consoleOutput}
                chartImage={chartImage}
                hideGeneratedQuery={hideGeneratedQuery}
              />
              
              <ResultsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                resultsLength={results.length}
                itemsPerPage={itemsPerPage}
                onPreviousPage={goToPreviousPage}
                onNextPage={goToNextPage}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BaseCodeEditor;
