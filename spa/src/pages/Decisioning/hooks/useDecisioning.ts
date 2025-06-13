
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDataSelection } from "./useDataSelection";
import { useProcessing } from "./useProcessing";
import { useInsightManagement } from "./useInsightManagement";
import { DataItem } from "../types";

export const useDecisioning = () => {
  const [message, setMessage] = useState("");
  const [showDataSelection, setShowDataSelection] = useState(false);
  const [showDocSelection, setShowDocSelection] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const dataSelection = useDataSelection();
  const processing = useProcessing();
  const insightManagement = useInsightManagement();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dataSelection.hasAnyItemSelected()) {
      toast({
        title: "Processing query",
        description: "Analyzing your query against selected data sources and documents."
      });
      setMessage("");
    } else {
      toast({
        title: "No data selected",
        description: "Please select at least one data source or document to proceed.",
        variant: "destructive"
      });
    }
  };
  
  const handleRefresh = () => {
    dataSelection.setDataSources(dataSelection.dataSources.map(source => ({ ...source, selected: false })));
    dataSelection.setSavedQueries(dataSelection.savedQueries.map(query => ({ ...query, selected: false })));
    dataSelection.setDocuments(dataSelection.documents.map(doc => ({ ...doc, selected: false })));
    processing.setIsProcessingData(false);
    processing.setIsProcessingDoc(false);
    setMessage("");
    
    toast({
      title: "Analysis reset",
      description: "All selections have been cleared."
    });
  };

  // Add missing handlers
  const handleDataSourceToggle = (id: number) => {
    dataSelection.setDataSources(
      dataSelection.dataSources.map(source => 
        source.id === id ? { ...source, selected: !source.selected } : source
      )
    );
  };

  const handleQueryToggle = (id: number) => {
    dataSelection.setSavedQueries(
      dataSelection.savedQueries.map(query => 
        query.id === id ? { ...query, selected: !query.selected } : query
      )
    );
  };

  const handleDocumentToggle = (id: number) => {
    dataSelection.setDocuments(
      dataSelection.documents.map(doc => 
        doc.id === id ? { ...doc, selected: !doc.selected } : doc
      )
    );
  };

  return {
    message,
    setMessage,
    showDataSelection,
    setShowDataSelection,
    showDocSelection,
    setShowDocSelection,
    handleDataSourceToggle,
    handleQueryToggle,
    handleDocumentToggle,
    ...dataSelection,
    ...insightManagement,
    ...processing,
    handleSubmit,
    handleRefresh,
    navigate
  };
};
