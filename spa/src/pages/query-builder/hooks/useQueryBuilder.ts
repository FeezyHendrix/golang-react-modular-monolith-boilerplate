
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDataSelection } from "../../Decisioning/hooks/useDataSelection";

export interface SavedQuery {
  id: string;
  title: string;
  description: string;
  type: 'SQL' | 'Python' | 'Table Joins' | 'Transformations';
  content?: string;
  results?: any[];
  consoleOutput?: string;
  chartImage?: string;
  date: string;
}

export const useQueryBuilder = () => {
  const { toast } = useToast();
  const { getDatabaseSources, getFileSources } = useDataSelection();
  
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([
    { id: 'a', title: 'Sales Report', type: 'SQL', date: 'Apr 5, 2025 at 8:21 AM', description: 'Monthly sales summary' },
    { id: 'b', title: 'Customer Analysis', type: 'Python', date: 'Apr 5, 2025 at 8:28 AM', description: 'Customer segmentation' },
    { id: 'c', title: 'Inventory', type: 'SQL', date: 'Apr 5, 2025 at 8:43 AM', description: 'Current inventory levels' },
    { id: 'd', title: 'Marketing', type: 'Table Joins', date: 'Apr 5, 2025 at 8:50 AM', description: 'Campaign performance', content: 'SELECT * FROM marketing_campaigns' }
  ]);

  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [exportName, setExportName] = useState<string>("");
  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false);
  const [selectedQueryType, setSelectedQueryType] = useState<SavedQuery["type"]>("SQL");
  
  const [saveDetails, setSaveDetails] = useState({
    title: "",
    description: ""
  });

  const handleRunQuery = (content: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Query executed",
        description: "Query executed successfully"
      });
    }, 1000);
    
    return true;
  };
  
  const handleExport = (data?: any[]) => {
    if (exportName.trim().length === 0 || exportName.length > 30) {
      toast({
        title: "Invalid file name",
        description: "Please enter a file name (max 30 characters)"
      });
      return false;
    }
    
    // Convert actual data to CSV if available, otherwise use dummy data
    let csvContent;
    
    if (data && data.length > 0) {
      // Get headers from first object
      const headers = Object.keys(data[0]).filter(k => k !== 'id').join(',');
      
      // Convert each row to CSV
      const rows = data.map(row => {
        return Object.keys(row)
          .filter(k => k !== 'id')
          .map(k => row[k])
          .join(',');
      }).join('\n');
      
      csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    } else {
      // Fallback to dummy data
      csvContent = 
        "data:text/csv;charset=utf-8," + 
        "region,category,revenue,profit,units_sold,margin_percent\n" + 
        "West,Electronics,$245000,$73500,2450,30.00\n" + 
        "East,Electronics,$189500,$56850,3790,30.00\n" + 
        "Central,Electronics,$97200,$24300,1620,25.00";
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exportName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: `Data exported to ${exportName}.csv`
    });
    
    setExportDialogOpen(false);
    setExportName("");
    return true;
  };
  
  const handleSave = (content: any) => {
    if (saveDetails.title.trim().length === 0 || saveDetails.title.length > 10) {
      toast({
        title: "Invalid name",
        description: "Please enter a name (max 10 characters)"
      });
      return false;
    }
    
    if (saveDetails.description.trim().length === 0 || saveDetails.description.length > 25) {
      toast({
        title: "Invalid description",
        description: "Please enter a description (max 25 characters)"
      });
      return false;
    }
    
    // Check if title already exists
    const titleExists = savedQueries.some(
      query => query.title.toLowerCase() === saveDetails.title.toLowerCase() && query.type === selectedQueryType
    );
    
    if (titleExists) {
      toast({
        title: "Title already exists",
        description: "Please use a different title for your query"
      });
      return false;
    }
    
    // Add new query with actual content and results if available
    const newQuery: SavedQuery = {
      id: Date.now().toString(),
      title: saveDetails.title,
      description: saveDetails.description,
      type: selectedQueryType,
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
    
    // Handle different types of content
    if (typeof content === 'string') {
      newQuery.content = content;
    } else if (typeof content === 'object') {
      if (content.code) newQuery.content = content.code;
      if (content.results) newQuery.results = content.results;
      if (content.consoleOutput) newQuery.consoleOutput = content.consoleOutput;
      if (content.chartImage) newQuery.chartImage = content.chartImage;
    }
    
    setSavedQueries([...savedQueries, newQuery]);
    setSaveDialogOpen(false);
    setSaveDetails({ title: "", description: "" });
    
    toast({
      title: "Query saved",
      description: "Your query has been saved successfully"
    });
    
    return true;
  };
  
  const deleteQuery = (id: string) => {
    setSavedQueries(savedQueries.filter(query => query.id !== id));
    toast({
      title: "Query deleted",
      description: "Query has been deleted successfully"
    });
  };
  
  const getQueriesByType = (type: SavedQuery["type"] | "All") => {
    return type === "All" 
      ? savedQueries 
      : savedQueries.filter(query => query.type === type);
  };

  return {
    savedQueries,
    selectedDatabase,
    setSelectedDatabase,
    isProcessing,
    exportName,
    setExportName,
    saveDialogOpen,
    setSaveDialogOpen,
    exportDialogOpen,
    setExportDialogOpen,
    saveDetails,
    setSaveDetails,
    handleRunQuery,
    handleExport,
    handleSave,
    deleteQuery,
    getQueriesByType,
    selectedQueryType,
    setSelectedQueryType,
    getDatabaseSources,
    getFileSources
  };
};
