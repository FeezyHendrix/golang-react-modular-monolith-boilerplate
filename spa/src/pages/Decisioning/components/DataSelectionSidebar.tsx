import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Activity, Database, Lightbulb, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { DataItem } from "../types";

type DataSelectionSidebarProps = {
  dataSources: DataItem[];
  savedQueries: DataItem[];
  documents: DataItem[];
  showDataSelection: boolean;
  setShowDataSelection: (show: boolean) => void;
  showDocSelection: boolean;
  setShowDocSelection: (show: boolean) => void;
  isProcessingData: boolean;
  setIsProcessingData: (processing: boolean) => void;
  isProcessingDoc: boolean;
  setIsProcessingDoc: (processing: boolean) => void;
  handleDataSourceToggle: (id: number) => void;
  handleQueryToggle: (id: number) => void;
  handleDocumentToggle: (id: number) => void;
  handleProcessData: () => void;
  handleProcessDoc: () => void;
  insights: any[];
};

const DataSelectionSidebar: React.FC<DataSelectionSidebarProps> = ({
  dataSources,
  savedQueries,
  documents,
  showDataSelection,
  setShowDataSelection,
  showDocSelection,
  setShowDocSelection,
  isProcessingData,
  isProcessingDoc,
  handleDataSourceToggle,
  handleQueryToggle,
  handleDocumentToggle,
  handleProcessData,
  handleProcessDoc,
  insights,
}) => {
  const navigate = useNavigate();
  const selectedDataSources = dataSources.filter(source => source.selected);
  const selectedQueries = savedQueries.filter(query => query.selected);
  const selectedDocuments = documents.filter(doc => doc.selected);
  
  const handleViewAllInsights = () => {
    navigate('/reports');
  };

  return (
    <div className="w-64 border-r border-border bg-muted/30 h-full flex flex-col">
      <div className="p-4 font-medium text-lg">Data Selection</div>
      
      {/* Combined Data Selection */}
      <div className="px-4 py-2">
        <div className="bg-background rounded-md p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Selected Data</div>
            <Dialog open={showDataSelection} onOpenChange={setShowDataSelection}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-primary text-xs">
                  <Plus size={12} className="mr-1" /> Add Data
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Select Data</DialogTitle>
                  <DialogDescription>
                    Choose the data sources and saved queries to use for your analysis.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="sources" className="mt-4">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="sources">Data Sources</TabsTrigger>
                    <TabsTrigger value="queries">Saved Queries</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="sources" className="space-y-4 max-h-[300px] overflow-y-auto">
                    {dataSources.map((source) => (
                      <div key={source.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                        <Checkbox
                          id={`source-${source.id}`}
                          checked={source.selected}
                          onCheckedChange={() => handleDataSourceToggle(source.id)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`source-${source.id}`} className="font-medium cursor-pointer">
                            {source.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{source.type}</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="queries" className="space-y-4 max-h-[300px] overflow-y-auto">
                    {savedQueries.map((query) => (
                      <div key={query.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                        <Checkbox
                          id={`query-${query.id}`}
                          checked={query.selected}
                          onCheckedChange={() => handleQueryToggle(query.id)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`query-${query.id}`} className="font-medium cursor-pointer">
                            {query.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{query.type}</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowDataSelection(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowDataSelection(false)}>
                    Apply Selection
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Selected Documents</div>
            <Dialog open={showDocSelection} onOpenChange={setShowDocSelection}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-primary text-xs">
                  <Plus size={12} className="mr-1" /> Add Documents
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Select Documents</DialogTitle>
                  <DialogDescription>
                    Choose the documents to include in your analysis.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto mt-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                      <Checkbox
                        id={`doc-${doc.id}`}
                        checked={doc.selected}
                        onCheckedChange={() => handleDocumentToggle(doc.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`doc-${doc.id}`} className="font-medium cursor-pointer">
                          {doc.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{doc.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowDocSelection(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowDocSelection(false)}>
                    Apply Selection
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Data Processing Controls */}
          {(selectedDataSources.length > 0 || selectedQueries.length > 0) && (
            <div className="mb-3 flex items-center gap-2 p-2 border rounded-md">
              <Switch
                checked={isProcessingData}
                onCheckedChange={handleProcessData}
                id="data-processing"
              />
              <Label htmlFor="data-processing" className="text-sm cursor-pointer flex items-center">
                Process data
                {isProcessingData && <Activity className="animate-spin ml-2 h-3 w-3" />}
              </Label>
            </div>
          )}
          
          {selectedDocuments.length > 0 && (
            <div className="mb-3 flex items-center gap-2 p-2 border rounded-md">
              <Switch
                checked={isProcessingDoc}
                onCheckedChange={handleProcessDoc}
                id="doc-processing"
              />
              <Label htmlFor="doc-processing" className="text-sm cursor-pointer flex items-center">
                Process documents
                {isProcessingDoc && <Activity className="animate-spin ml-2 h-3 w-3" />}
              </Label>
            </div>
          )}
          
          {selectedDataSources.length === 0 && selectedQueries.length === 0 && selectedDocuments.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              <Database className="mx-auto h-6 w-6 mb-1 text-muted-foreground/70" />
              <p>No data selected</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDataSources.length > 0 && (
                <div>
                  <div className="text-xs font-medium mb-1">Data Sources</div>
                  <div className="space-y-1">
                    {selectedDataSources.map(source => (
                      <div key={source.id} className="flex justify-between items-center text-sm p-1 rounded hover:bg-muted">
                        <span>{source.name}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5" 
                          onClick={() => handleDataSourceToggle(source.id)}
                        >
                          <span>×</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedQueries.length > 0 && (
                <div>
                  <div className="text-xs font-medium mb-1">Saved Queries</div>
                  <div className="space-y-1">
                    {selectedQueries.map(query => (
                      <div key={query.id} className="flex justify-between items-center text-sm p-1 rounded hover:bg-muted">
                        <span>{query.name}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5" 
                          onClick={() => handleQueryToggle(query.id)}
                        >
                          <span>×</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedDocuments.length > 0 && (
                <div>
                  <div className="text-xs font-medium mb-1">Documents</div>
                  <div className="space-y-1">
                    {selectedDocuments.map(doc => (
                      <div key={doc.id} className="flex justify-between items-center text-sm p-1 rounded hover:bg-muted">
                        <span>{doc.name}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5" 
                          onClick={() => handleDocumentToggle(doc.id)}
                        >
                          <span>×</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Top AI Insights section */}
      <div className="mt-auto p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Lightbulb size={16} className="text-amber-400 mr-2" />
            <span className="text-sm font-medium">Top AI Insights</span>
          </div>
          <Button variant="link" size="sm" className="h-6 text-xs text-primary" onClick={handleViewAllInsights}>
            View all <ChevronRight size={14} />
          </Button>
        </div>
        
        {/* Insight cards */}
        <div className="space-y-3">
          {insights.map((insight) => (
            <Card key={insight.id} className="border">
              <CardContent className="p-3 space-y-1">
                <h3 className="text-sm font-medium">{insight.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {insight.description}
                </p>
                <div className="flex gap-1 mt-1">
                  <span className={`inline-flex text-xs ${
                    insight.category === 'Sales' ? 'bg-blue-100 text-blue-800' :
                    insight.category === 'Finance' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  } px-2 py-0.5 rounded-full`}>{insight.category}</span>
                  <span className={`inline-flex text-xs ${
                    insight.priority === 'High' ? 'bg-red-100 text-red-800' :
                    insight.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  } px-2 py-0.5 rounded-full`}>{insight.priority}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSelectionSidebar;
