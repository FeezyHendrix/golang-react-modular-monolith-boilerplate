
import React from "react";
import { Button } from "@/components/ui/button";
import { useQuestionSuggestions } from "../hooks/useQuestionSuggestions";
import { DataItem } from "../types";

type SuggestedQuestionsProps = {
  setMessage: (message: string) => void;
  dataSources: DataItem[];
  documents: DataItem[];
  isProcessingData: boolean;
  isProcessingDoc: boolean;
};

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  setMessage,
  dataSources,
  documents,
  isProcessingData,
  isProcessingDoc
}) => {
  const { suggestedQuestions } = useQuestionSuggestions(
    dataSources,
    documents,
    isProcessingData,
    isProcessingDoc
  );

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">You might want to ask:</p>
      
      <div className="grid grid-cols-1 gap-2">
        {suggestedQuestions.map((question, index) => (
          <Button 
            key={index}
            variant="outline" 
            className="justify-start text-left h-auto py-3" 
            onClick={() => setMessage(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
