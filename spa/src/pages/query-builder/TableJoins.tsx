
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowRight, Play, Download, Save, Database, CircleHelp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryBuilder } from "./hooks/useQueryBuilder";
import { useDataSelection } from "../Decisioning/hooks/useDataSelection";
import SaveQueryDialog from "./components/SaveQueryDialog";
import ExportDialog from "./components/ExportDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const TableJoins: React.FC = () => {
  const { toast } = useToast();
  const { getFileSources } = useDataSelection();
  const {
    saveDialogOpen,
    setSaveDialogOpen,
    exportDialogOpen,
    setExportDialogOpen,
    saveDetails,
    setSaveDetails,
    exportName,
    setExportName,
    handleSave,
    handleExport,
    handleRunQuery,
    setSelectedQueryType
  } = useQueryBuilder();

  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [tableSearch, setTableSearch] = useState("");
  const [hasResults, setHasResults] = useState(false);
  const [fileSources, setFileSources] = useState(getFileSources());
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [joinConfigs, setJoinConfigs] = useState<Array<{
    leftTable: string;
    rightTable: string;
    joinType: string;
    leftColumn: string;
    rightColumn: string;
  }>>([]);
  const [generatedQuery, setGeneratedQuery] = useState("");

  // Use file sources for available tables
  const availableTables = fileSources.map(source => {
    return {
      name: source.name.toLowerCase().replace(/\s+/g, '_'),
      fields: ["id", "name", "email", "created_at"] // Sample fields, would come from API in real app
    };
  });

  const sampleTables = availableTables.length > 0 ? availableTables : [
    { name: "customers", fields: ["id", "name", "email", "created_at"] },
    { name: "orders", fields: ["id", "customer_id", "amount", "status", "created_at"] }
  ];

  const filteredTables = sampleTables.filter(
    table => table.name.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const addTable = (tableName: string) => {
    if (!selectedTables.includes(tableName)) {
      setSelectedTables([...selectedTables, tableName]);
      
      // If we already have one table, automatically create a join config
      if (selectedTables.length > 0) {
        const leftTable = selectedTables[selectedTables.length - 1];
        const newJoinConfig = {
          leftTable,
          rightTable: tableName,
          joinType: "inner",
          leftColumn: "",
          rightColumn: ""
        };
        setJoinConfigs([...joinConfigs, newJoinConfig]);
      }
    }
  };

  const updateJoinConfig = (index: number, field: string, value: string) => {
    const newJoinConfigs = [...joinConfigs];
    newJoinConfigs[index] = {
      ...newJoinConfigs[index],
      [field]: value
    };
    setJoinConfigs(newJoinConfigs);
  };

  const executeQuery = () => {
    if (selectedTables.length < 2) {
      toast({
        title: "Not enough tables",
        description: "Please select at least two tables to create a join",
        variant: "destructive"
      });
      return;
    }

    if (joinConfigs.some(config => !config.leftColumn || !config.rightColumn)) {
      toast({
        title: "Incomplete join configuration",
        description: "Please select columns for all join operations",
        variant: "destructive"
      });
      return;
    }
    
    // Generate SQL query
    let sql = "SELECT \n";
    
    // Add selected fields
    selectedTables.forEach(table => {
      const tableFields = sampleTables.find(t => t.name === table)?.fields || [];
      tableFields.forEach(field => {
        sql += `  ${table}.${field},\n`;
      });
    });
    
    // Remove last comma
    sql = sql.slice(0, -2);
    sql += "\nFROM ";
    
    // Add FROM clause with first table
    sql += selectedTables[0];
    
    // Add joins
    joinConfigs.forEach(config => {
      sql += `\n${config.joinType.toUpperCase()} JOIN ${config.rightTable} ON ${config.leftTable}.${config.leftColumn} = ${config.rightTable}.${config.rightColumn}`;
    });
    
    setGeneratedQuery(sql);
    handleRunQuery(sql);
    setHasResults(true);
  };

  const handleSaveClick = () => {
    setSelectedQueryType("Table Joins");
    setSaveDialogOpen(true);
  };

  const onSaveConfirm = () => {
    handleSave(generatedQuery);
  };
  
  const onExportConfirm = () => {
    handleExport();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <div className="flex space-x-2">
          <Button onClick={handleSaveClick} variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button onClick={() => setExportDialogOpen(true)} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={executeQuery}>
            <Play className="mr-2 h-4 w-4" />
            Run Query
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Data sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Database className="mr-2 h-4 w-4" />
              Available Tables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input 
                placeholder="Search tables..." 
                className="mb-2"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
              />
              <ScrollArea className="h-[400px]">
                {filteredTables.map((table) => (
                  <div 
                    key={table.name} 
                    className="p-2 border rounded-md mb-2 hover:bg-muted cursor-pointer flex justify-between items-center"
                    onClick={() => addTable(table.name)}
                  >
                    <div>
                      <div className="font-medium">{table.name}</div>
                      <div className="text-xs text-muted-foreground">{table.fields.length} fields</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Middle column - Join configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Join Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTables.length < 2 ? (
              <div className="text-center p-6">
                <CircleHelp className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                <p className="text-muted-foreground">Select at least two tables to configure joins</p>
              </div>
            ) : (
              <div className="space-y-4">
                {joinConfigs.map((config, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{config.leftTable} <ArrowRight className="inline h-4 w-4" /> {config.rightTable}</div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 items-center">
                      <Select 
                        value={config.joinType} 
                        onValueChange={(value) => updateJoinConfig(index, "joinType", value)}
                      >
                        <SelectTrigger className="col-span-2">
                          <SelectValue placeholder="Join type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inner">Inner Join</SelectItem>
                          <SelectItem value="left">Left Join</SelectItem>
                          <SelectItem value="right">Right Join</SelectItem>
                          <SelectItem value="full">Full Outer Join</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <span className="text-center">on</span>
                      
                      <Select 
                        value={config.leftColumn}
                        onValueChange={(value) => updateJoinConfig(index, "leftColumn", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Column" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleTables.find(t => t.name === config.leftTable)?.fields.map(field => (
                            <SelectItem key={field} value={field}>{field}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={config.rightColumn}
                        onValueChange={(value) => updateJoinConfig(index, "rightColumn", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Column" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleTables.find(t => t.name === config.rightTable)?.fields.map(field => (
                            <SelectItem key={field} value={field}>{field}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column - Field selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Fields</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTables.length === 0 ? (
              <div className="text-center p-6">
                <CircleHelp className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                <p className="text-muted-foreground">Select tables to choose fields</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedTables.map((tableName) => {
                  const table = sampleTables.find(t => t.name === tableName);
                  return (
                    <div key={tableName} className="border rounded-md p-2">
                      <div className="font-medium mb-1">{tableName}</div>
                      <div className="grid grid-cols-2 gap-1">
                        {table?.fields.map(field => (
                          <div key={field} className="flex items-center space-x-2">
                            <input type="checkbox" id={`${tableName}-${field}`} className="rounded" defaultChecked />
                            <label htmlFor={`${tableName}-${field}`} className="text-sm">{field}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results section */}
      <Card>
        <CardHeader>
          <CardTitle>Query Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="results">
            <TabsList>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="query">Generated Query</TabsTrigger>
            </TabsList>
            <TabsContent value="results" className="p-2">
              {hasResults ? (
                <div className="rounded border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>id</TableHead>
                        <TableHead>customer_name</TableHead>
                        <TableHead>order_id</TableHead>
                        <TableHead>amount</TableHead>
                        <TableHead>status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">1</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>1001</TableCell>
                        <TableCell>$249.99</TableCell>
                        <TableCell>Completed</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">1</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>1002</TableCell>
                        <TableCell>$79.99</TableCell>
                        <TableCell>Processing</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">2</TableCell>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>1003</TableCell>
                        <TableCell>$124.50</TableCell>
                        <TableCell>Completed</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  Run your query to see results
                </div>
              )}
            </TabsContent>
            <TabsContent value="query" className="p-2">
              {hasResults ? (
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{generatedQuery}</code>
                </pre>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  Run your query to see the generated SQL
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <SaveQueryDialog
        open={saveDialogOpen}
        setOpen={setSaveDialogOpen}
        title={saveDetails.title}
        setTitle={(title) => setSaveDetails({ ...saveDetails, title })}
        description={saveDetails.description}
        setDescription={(description) => setSaveDetails({ ...saveDetails, description })}
        onSave={onSaveConfirm}
      />

      <ExportDialog
        open={exportDialogOpen}
        setOpen={setExportDialogOpen}
        fileName={exportName}
        setFileName={setExportName}
        onExport={onExportConfirm}
      />
    </div>
  );
};

export default TableJoins;
