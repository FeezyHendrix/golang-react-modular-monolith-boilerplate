
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useProcessing = () => {
  const [isProcessingData, setIsProcessingData] = useState(false);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const { toast } = useToast();

  const handleProcessData = () => {
    setIsProcessingData(!isProcessingData);
    if (!isProcessingData) {
      toast({
        title: "Processing data",
        description: "Your selected data sources are being processed..."
      });
      
      setTimeout(() => {
        toast({
          title: "Data processing complete",
          description: "Selected data sources are now ready for AI analysis."
        });
      }, 2000);
    }
  };
  
  const handleProcessDoc = () => {
    setIsProcessingDoc(!isProcessingDoc);
    if (!isProcessingDoc) {
      toast({
        title: "Processing documents",
        description: "Your selected documents are being processed..."
      });
      
      setTimeout(() => {
        toast({
          title: "Document processing complete",
          description: "Selected documents are now ready for AI analysis."
        });
      }, 2000);
    }
  };

  return {
    isProcessingData,
    setIsProcessingData,
    isProcessingDoc,
    setIsProcessingDoc,
    handleProcessData,
    handleProcessDoc
  };
};
