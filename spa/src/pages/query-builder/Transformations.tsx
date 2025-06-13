
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Play, Download, Save, Database, Plus, X, ArrowDown, ArrowUp,
  Filter, Calculator, SortAsc, SortDesc, ListFilter, Layers
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataSelection } from "../Decisioning/hooks/useDataSelection";
import { useQueryBuilder } from "./hooks/useQueryBuilder";
import SaveQueryDialog from "./components/SaveQueryDialog";
import ExportDialog from "./components/ExportDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const Transformations: React.FC = () => {
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
  
  const [tableSearch, setTableSearch] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [hasResults, setHasResults] = useState(false);
  const [fileSources, setFileSources] = useState(getFileSources());
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [generatedQuery, setGeneratedQuery] = useState("");

  // Use file sources for available tables
  const availableTables = fileSources.map(source => {
    return {
      name: source.name.toLowerCase().replace(/\s+/g, '_'),
      fields: ["date", "region", "product", "category", "revenue", "cost", "profit", "units_sold", "customer_id", "salesperson"] // Sample fields
    };
  });

  const sampleTables = availableTables.length > 0 ? availableTables : [
    { name: "sales_data", fields: ["date", "region", "product", "category", "revenue", "cost", "profit", "units_sold", "customer_id", "salesperson"] },
    { name: "customer_data", fields: ["id", "name", "email", "region", "segment", "joined_date", "last_purchase"] }
  ];

  const filteredTables = sampleTables.filter(
    table => table.name.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const executeQuery = () => {
    if (!selectedTable) {
      toast({
        title: "No table selected",
        description: "Please select a table to transform",
        variant: "destructive"
      });
      return;
    }
    
    // Generate SQL query
    const sql = `SELECT
  region,
  product,
  category,
  revenue,
  profit,
  (profit / revenue) * 100 AS margin_percent
FROM
  ${selectedTable}
WHERE
  region = 'West'
ORDER BY
  revenue DESC
LIMIT 100`;
    
    setGeneratedQuery(sql);
    handleRunQuery(sql);
    setHasResults(true);
  };

  const handleSaveClick = () => {
    setSelectedQueryType("Transformations");
    setSaveDialogOpen(true);
  };

  const onSaveConfirm = () => {
    handleSave(generatedQuery);
  };
  
  const onExportConfirm = () => {
    handleExport();
  };

  const selectTable = (tableName: string) => {
    setSelectedTable(tableName);
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

      <div className="grid grid-cols-12 gap-6">
        {/* Source data */}
        <Card className="col-span-12 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Database className="mr-2 h-4 w-4" />
              Source Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex">
                <Input 
                  placeholder="Search tables" 
                  className="mr-2"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[250px]">
                {filteredTables.map((table) => (
                  <div 
                    key={table.name}
                    className={`border rounded-md mb-2 cursor-pointer ${selectedTable === table.name ? 'bg-muted/50' : ''}`}
                    onClick={() => selectTable(table.name)}
                  >
                    <div className="p-3 border-b font-medium flex justify-between items-center">
                      <span>{table.name}</span>
                      {selectedTable === table.name && (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTable("")}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {selectedTable === table.name && (
                      <div className="p-2 max-h-[300px] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                          {table.fields.map((field) => (
                            <div key={field} className="flex items-center">
                              <input type="checkbox" id={field} className="mr-2" defaultChecked />
                              <label htmlFor={field} className="text-sm">{field}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Transformation pipeline */}
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Layers className="mr-2 h-4 w-4" />
              Transformation Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Filter transformation */}
              <div className="border rounded-md p-3 relative">
                <div className="absolute -left-7 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="font-medium">Filter</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <Select defaultValue="region">
                      <SelectTrigger>
                        <SelectValue placeholder="Column" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedTable && sampleTables.find(t => t.name === selectedTable)?.fields.map((field) => (
                          <SelectItem key={field} value={field}>{field}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Select defaultValue="equals">
                      <SelectTrigger>
                        <SelectValue placeholder="Operation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">equals</SelectItem>
                        <SelectItem value="not_equals">not equals</SelectItem>
                        <SelectItem value="greater_than">greater than</SelectItem>
                        <SelectItem value="less_than">less than</SelectItem>
                        <SelectItem value="contains">contains</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Input defaultValue="West" />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Calculate transformation */}
              <div className="border rounded-md p-3 relative">
                <div className="absolute -left-7 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Calculator className="mr-2 h-4 w-4 text-green-500" />
                    <span className="font-medium">Calculate</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <Input defaultValue="margin_percent" placeholder="New column name" />
                  </div>
                  <div className="col-span-7">
                    <Input defaultValue="(profit / revenue) * 100" placeholder="Formula" />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button variant="outline" size="sm">Format</Button>
                  </div>
                </div>
              </div>

              {/* Sort transformation */}
              <div className="border rounded-md p-3 relative">
                <div className="absolute -left-7 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <SortAsc className="mr-2 h-4 w-4 text-purple-500" />
                    <span className="font-medium">Sort</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Select defaultValue="revenue">
                      <SelectTrigger>
                        <SelectValue placeholder="Column" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedTable && [
                          ...sampleTables.find(t => t.name === selectedTable)?.fields || [],
                          "margin_percent"
                        ].map((field) => (
                          <SelectItem key={field} value={field}>{field}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Select defaultValue="desc">
                      <SelectTrigger>
                        <SelectValue placeholder="Direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">First</SelectItem>
                        <SelectItem value="2">Second</SelectItem>
                        <SelectItem value="3">Third</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add transformation button */}
              <div className="flex justify-center">
                <Select>
                  <SelectTrigger className="w-auto">
                    <div className="flex items-center">
                      <Plus className="mr-1 h-4 w-4" />
                      <span>Add Transformation</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filter">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Filter</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="calculate">
                      <div className="flex items-center">
                        <Calculator className="mr-2 h-4 w-4 text-green-500" />
                        <span>Calculate</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="sort">
                      <div className="flex items-center">
                        <SortAsc className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Sort</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="group">
                      <div className="flex items-center">
                        <ListFilter className="mr-2 h-4 w-4 text-orange-500" />
                        <span>Group By</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results section */}
      <Card>
        <CardHeader>
          <CardTitle>Transformation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Generated Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="p-2">
              {hasResults ? (
                <div className="rounded border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>region</TableHead>
                        <TableHead>product</TableHead>
                        <TableHead>category</TableHead>
                        <TableHead>revenue</TableHead>
                        <TableHead>profit</TableHead>
                        <TableHead>margin_percent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>West</TableCell>
                        <TableCell>Laptop Pro</TableCell>
                        <TableCell>Electronics</TableCell>
                        <TableCell>$245,000</TableCell>
                        <TableCell>$73,500</TableCell>
                        <TableCell>30.0%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>West</TableCell>
                        <TableCell>Phone X</TableCell>
                        <TableCell>Electronics</TableCell>
                        <TableCell>$189,500</TableCell>
                        <TableCell>$56,850</TableCell>
                        <TableCell>30.0%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>West</TableCell>
                        <TableCell>Smart Watch</TableCell>
                        <TableCell>Electronics</TableCell>
                        <TableCell>$97,200</TableCell>
                        <TableCell>$24,300</TableCell>
                        <TableCell>25.0%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  Run your transformation to see results
                </div>
              )}
            </TabsContent>
            <TabsContent value="code" className="p-2">
              {hasResults ? (
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{generatedQuery}</code>
                </pre>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  Run your transformation to see the generated SQL
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

export default Transformations;
