
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Download, Copy, Save, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDataSelection } from "../Decisioning/hooks/useDataSelection";
import { useQueryBuilder } from "./hooks/useQueryBuilder";
import SaveQueryDialog from "./components/SaveQueryDialog";
import ExportDialog from "./components/ExportDialog";

const SqlQuery: React.FC = () => {
  const { toast } = useToast();
  const { getDatabaseSources } = useDataSelection();
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

  const [query, setQuery] = useState<string>("SELECT * FROM customers LIMIT 10;");
  const [selectedDataSource, setSelectedDataSource] = useState<string>("");
  const [databases, setDatabases] = useState(getDatabaseSources());
  const [hasResults, setHasResults] = useState(false);

  // Sample results - would normally come from API
  const sampleResults = {
    columns: ["id", "name", "email", "created_at", "status"],
    rows: [
      { id: 1, name: "John Doe", email: "john@example.com", created_at: "2023-01-15", status: "active" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", created_at: "2023-02-20", status: "active" },
      { id: 3, name: "Robert Johnson", email: "robert@example.com", created_at: "2023-03-10", status: "inactive" },
      { id: 4, name: "Sarah Williams", email: "sarah@example.com", created_at: "2023-04-05", status: "active" },
      { id: 5, name: "Michael Brown", email: "michael@example.com", created_at: "2023-05-12", status: "pending" },
    ],
  };

  const executeQuery = () => {
    if (!selectedDataSource) {
      toast({
        title: "No database selected",
        description: "Please select a database to run the query",
        variant: "destructive"
      });
      return;
    }
    
    // Check for table existence - only recognize tables from known databases
    const tableNames = ["customers", "orders", "products", "users"];
    const queryLower = query.toLowerCase();
    
    let tableFound = false;
    for (const table of tableNames) {
      if (queryLower.includes(table)) {
        tableFound = true;
        break;
      }
    }
    
    if (!tableFound && queryLower.includes("from ")) {
      toast({
        title: "Table not recognized",
        description: "The specified table doesn't exist in the selected database",
        variant: "destructive"
      });
      return;
    }
    
    handleRunQuery(query);
    setHasResults(true);
  };

  const copyQuery = () => {
    navigator.clipboard.writeText(query);
    toast({
      title: "Query copied",
      description: "SQL query copied to clipboard",
    });
  };

  const handleSaveClick = () => {
    setSelectedQueryType("SQL");
    setSaveDialogOpen(true);
  };

  const onSaveConfirm = () => {
    handleSave(query);
  };
  
  const onExportConfirm = () => {
    handleExport();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="w-64">
          <Select 
            value={selectedDataSource} 
            onValueChange={setSelectedDataSource}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select data source" />
            </SelectTrigger>
            <SelectContent>
              {databases.map((source) => (
                <SelectItem key={source.id} value={source.id.toString()}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSaveClick} variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button onClick={() => setExportDialogOpen(true)} variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={executeQuery}>
            <Play className="mr-2 h-4 w-4" />
            Run Query
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <div className="flex items-center justify-between bg-muted p-2 border-b">
          <div className="text-sm font-medium">SQL Editor</div>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" onClick={copyQuery}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <textarea
          className="w-full p-4 code-editor font-mono bg-background focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={8}
        />
      </div>

      <div className="border rounded-md mt-6">
        <div className="flex items-center justify-between p-2 bg-muted border-b">
          <div className="text-sm font-medium">Results</div>
          <Button size="sm" variant="ghost" onClick={() => setExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-1" />
            Download CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          {hasResults ? (
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  {sampleResults.columns.map((column) => (
                    <th key={column} className="text-left p-2 text-sm font-medium text-muted-foreground">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleResults.rows.map((row, i) => (
                  <tr key={i} className="border-t hover:bg-muted/20">
                    {sampleResults.columns.map((column) => (
                      <td key={column} className="p-2 text-sm">
                        {row[column as keyof typeof row]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Run a query to see results
            </div>
          )}
        </div>
        {hasResults && (
          <div className="p-2 text-sm text-muted-foreground border-t">
            Showing 5 of 152 rows
          </div>
        )}
      </div>

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

export default SqlQuery;
