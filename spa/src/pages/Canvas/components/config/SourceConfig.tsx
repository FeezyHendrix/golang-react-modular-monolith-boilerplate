
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SourceOperatorData, OperatorStatus } from '../../types';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { FileUp, Database as DatabaseIcon, Code, Edit, Save, Pencil } from "lucide-react";
import SqlEditor from '@/pages/query-builder/components/SqlEditor';
import PythonEditor from '@/pages/query-builder/components/PythonEditor';
import { SourceConfigProps } from './types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const SourceConfig: React.FC<SourceConfigProps> = ({ 
  operator, 
  onUpdateOperator,
  onSave
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(operator.selectedColumns || []);
  const [availableColumns, setAvailableColumns] = useState<string[]>(operator.availableColumns || []);
  const [activeTab, setActiveTab] = useState<string>(operator.dataSource?.type === "file" ? "upload" : "datasource");
  const [connectionType, setConnectionType] = useState<string>(operator.dataSource?.type || "");
  const [dataSource, setDataSource] = useState<string>(operator.dataSource?.connection || "");
  const [showScriptEditor, setShowScriptEditor] = useState<boolean>(false);
  const [showScriptDialog, setShowScriptDialog] = useState<boolean>(false);
  const [sqlQuery, setSqlQuery] = useState<string>(operator.script?.type === "sql" ? operator.script.content : "SELECT * FROM table");
  const [pythonCode, setPythonCode] = useState<string>(operator.script?.type === "python" ? operator.script.content : "import pandas as pd\n\n# Your code here\ndf = pd.read_csv('data.csv')\nprint(df.head())");
  const [scriptResults, setScriptResults] = useState<any[]>(operator.scriptResults || []);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(!!operator.dataSource?.name);
  const [consoleOutput, setConsoleOutput] = useState<string>(operator.consoleOutput || "");
  const [isConfigured, setIsConfigured] = useState<boolean>(operator.status === OperatorStatus.CONFIGURED);
  const [isEditing, setIsEditing] = useState<boolean>(!isConfigured);
  const { toast } = useToast();

  const connectionTypes = ["Database", "API", "Files"];
  
  const dataSources = {
    "Database": ["MySQL Production", "PostgreSQL Analytics", "SQLite Local"],
    "API": ["REST API Service", "GraphQL Endpoint", "Weather API"],
    "Files": ["Sales Records", "Customer Data", "Marketing Reports"]
  };

  useEffect(() => {
    // Set the active tab based on previously configured data
    if (operator.dataSource?.type === "file") {
      setActiveTab("upload");
      setIsFileUploaded(!!operator.dataSource.name);
    } else if (operator.dataSource?.type) {
      setActiveTab("datasource");
    }
    
    // Set the configured status based on the operator status
    setIsConfigured(operator.status === OperatorStatus.CONFIGURED);
    setIsEditing(!operator.status || operator.status !== OperatorStatus.CONFIGURED);
  }, [operator.dataSource, operator.status]);

  // Determine if the Add button should be enabled
  const isAddButtonEnabled = () => {
    if (isProcessing) return false;
    
    if (activeTab === "upload") {
      return isFileUploaded;
    }
    
    if (activeTab === "datasource") {
      return availableColumns.length > 0 && selectedColumns.length > 0;
    }
    
    return false;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['doc', 'docx', 'csv', 'pdf', 'xlsx', 'xls', 'parquet'];
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload only Doc, CSV, PDF, Excel, or Parquet files."
      });
      return;
    }
    
    setIsFileUploaded(true);
    
    onUpdateOperator({
      ...operator,
      dataSource: {
        ...operator.dataSource,
        type: "file",
        name: file.name,
        size: file.size
      }
    });
    
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded successfully.`
    });
  };

  const handleConnectionTypeChange = (type: string) => {
    setConnectionType(type);
    setDataSource("");
    
    onUpdateOperator({
      ...operator,
      dataSource: {
        ...operator.dataSource,
        type: type.toLowerCase(),
        connection: null
      }
    });
  };
  
  const handleDataSourceChange = (source: string) => {
    setDataSource(source);
    
    onUpdateOperator({
      ...operator,
      dataSource: {
        ...operator.dataSource,
        connection: source
      }
    });
  };
  
  const handleScriptEditorOpen = () => {
    setShowScriptDialog(true);
  };

  const handleScriptEditorClose = () => {
    setShowScriptDialog(false);
    setShowScriptEditor(false);
  };

  const handleAddData = (columns: string[], data: any[], output: string = "") => {
    setAvailableColumns(columns);
    setSelectedColumns(columns);  // By default select all columns
    setScriptResults(data);
    setConsoleOutput(output);
    
    // Update the operator with the script results and columns
    onUpdateOperator({
      ...operator,
      availableColumns: columns,
      selectedColumns: columns,
      scriptResults: data,
      consoleOutput: output
    });
    
    setShowScriptDialog(false);
    setShowScriptEditor(false);
    
    toast({
      title: "Data Added",
      description: `${columns.length} columns have been successfully added for this source.`
    });
  };

  const handleColumnSelectionChange = (columnName: string, isChecked: boolean) => {
    let updatedColumns;
    
    if (isChecked) {
      updatedColumns = [...selectedColumns, columnName];
    } else {
      updatedColumns = selectedColumns.filter(col => col !== columnName);
    }
    
    setSelectedColumns(updatedColumns);
    
    onUpdateOperator({
      ...operator,
      selectedColumns: updatedColumns
    });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onUpdateOperator({
        ...operator,
        status: OperatorStatus.CONFIGURED
      });
      setIsConfigured(true);
      setIsEditing(false);
      setIsProcessing(false);
      
      if (onSave) {
        onSave();
      }
    }, 500);
  };

  return (
    <div className="space-y-4">
      {isConfigured && !isEditing ? (
        // Configured view - show read-only information with edit option
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-md border">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium text-lg">Data Source</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleEditMode}
                className="flex items-center gap-1"
              >
                <Pencil className="h-4 w-4" />
                Modify
              </Button>
            </div>
            <div className="text-sm space-y-2">
              {operator.dataSource?.type === "file" ? (
                // Display file information
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>File</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File:</span>
                    <span>{operator.dataSource.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{Math.round((operator.dataSource.size || 0) / 1024)} KB</span>
                  </div>
                </>
              ) : (
                // Display database/API information
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{operator.dataSource?.type || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source:</span>
                    <span>{operator.dataSource?.connection || "Unknown"}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Columns:</span>
                <span>{operator.selectedColumns?.length || 0}</span>
              </div>
            </div>
          </div>
          
          {/* Preview of selected columns */}
          {operator.selectedColumns && operator.selectedColumns.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <Label className="text-sm font-medium mb-2 block">Selected Columns</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {operator.selectedColumns.map((column) => (
                    <div key={column} className="text-sm px-2 py-1 bg-muted/30 rounded">
                      {column}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show View/Edit Script button in configured view */}
          {operator.script && (
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleScriptEditorOpen}
            >
              <Code className="mr-2 h-4 w-4" />
              View/Edit Script
            </Button>
          )}
        </div>
      ) : (
        // Edit mode
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="upload">
              <FileUp className="mr-2 h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="datasource">
              <DatabaseIcon className="mr-2 h-4 w-4" />
              Select Data Source
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
              <FileUp className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-center text-muted-foreground mb-2">
                Upload Doc, CSV, PDF, Excel, or Parquet files
              </p>
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                accept=".doc,.docx,.csv,.pdf,.xlsx,.xls,.parquet"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('fileUpload')?.click()}
              >
                Select File
              </Button>
            </div>
            
            {operator.dataSource?.type === "file" && operator.dataSource?.name && (
              <div className="bg-muted p-3 rounded-md">
                <div className="text-sm font-medium">Selected File:</div>
                <div className="text-sm">{operator.dataSource.name}</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((operator.dataSource.size || 0) / 1024)} KB
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="datasource" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="connectionType">Connection Type</Label>
              <Select 
                value={connectionType} 
                onValueChange={handleConnectionTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select connection type" />
                </SelectTrigger>
                <SelectContent>
                  {connectionTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {connectionType && (
              <div>
                <Label htmlFor="dataSource">Data Source</Label>
                <Select 
                  value={dataSource} 
                  onValueChange={handleDataSourceChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources[connectionType as keyof typeof dataSources]?.map(source => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {dataSource && (
              <Button 
                className="w-full mt-4" 
                onClick={handleScriptEditorOpen}
              >
                <Code className="mr-2 h-4 w-4" />
                Write Script
              </Button>
            )}
            
            {/* Display console output if available */}
            {consoleOutput && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <Label className="text-sm font-medium mb-2 block">Console Output</Label>
                  <div className="bg-muted/30 border rounded-md p-3 font-mono text-sm h-60 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Display available columns if any */}
            {availableColumns.length > 0 && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <Label className="text-sm font-medium mb-2 block">Available Columns</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {availableColumns.map((column) => (
                      <div key={column} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`column-${column}`} 
                          checked={selectedColumns.includes(column)}
                          onCheckedChange={(checked) => 
                            handleColumnSelectionChange(column, checked === true)
                          }
                        />
                        <Label htmlFor={`column-${column}`} className="text-sm">
                          {column}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedColumns.length} of {availableColumns.length} columns selected
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Script Editor Dialog - Show the current script */}
      <Dialog open={showScriptDialog} onOpenChange={setShowScriptDialog}>
        <DialogContent className="max-w-4xl">
          {connectionType === "Database" || operator.script?.type === "sql" ? (
            <SqlEditor
              sqlQuery={sqlQuery}
              setSqlQuery={setSqlQuery}
              onClose={handleScriptEditorClose}
              onAddData={(columns, data, output) => {
                // Also save the script itself
                onUpdateOperator({
                  ...operator,
                  script: {
                    type: "sql",
                    content: sqlQuery
                  }
                });
                handleAddData(columns, data, output);
              }}
            />
          ) : (
            <PythonEditor
              pythonCode={pythonCode}
              setPythonCode={setPythonCode}
              onClose={handleScriptEditorClose}
              onAddData={(columns, data, output) => {
                // Also save the script itself
                onUpdateOperator({
                  ...operator,
                  script: {
                    type: "python",
                    content: pythonCode
                  }
                });
                handleAddData(columns, data, output);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Only show the save/update button when in edit mode and there's something to save */}
      {(!isConfigured || isEditing) && (
        <Button 
          className="w-full" 
          onClick={handleSave}
          disabled={!isAddButtonEnabled() || isProcessing}
        >
          {isProcessing ? 'Processing...' : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isConfigured ? 'Update' : 'Save'}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default SourceConfig;
