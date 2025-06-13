
import { useState, useEffect } from 'react';
import { DataItem } from '../types';

export const useQuestionSuggestions = (
  dataSources: DataItem[],
  documents: DataItem[],
  isProcessingData: boolean,
  isProcessingDoc: boolean
) => {
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "What are the key trends in our sales data for the last quarter?",
    "Can you identify potential cost-saving opportunities in our current operations?"
  ]);

  useEffect(() => {
    const generateQuestions = () => {
      const selectedData = dataSources.filter(source => source.selected);
      const selectedDocs = documents.filter(doc => doc.selected);
      
      let questions: string[] = [];
      
      if (selectedData.length > 0) {
        // Simulate analyzing first 5 rows of data sources
        questions = selectedData.map(source => {
          if (!source.type) return `What insights can you provide from the ${source.name}?`;
          
          switch(source.type) {
            case "PostgreSQL":
              return `What insights can you provide from the ${source.name} database tables?`;
            case "REST API":
              return `What are the key metrics from the ${source.name} endpoints?`;
            case "MySQL":
              return `Can you analyze the patterns in ${source.name}?`;
            case "Amazon S3":
              return `What trends can you identify in the ${source.name}?`;
            default:
              return `What valuable insights can we extract from ${source.name}?`;
          }
        }).slice(0, 2);
      }
      
      if (selectedDocs.length > 0) {
        const docQuestions = selectedDocs.map(doc => {
          if (!doc.type) return `What insights can we gather from ${doc.name}?`;
          
          const fileType = doc.type.toLowerCase();
          switch(fileType) {
            case "pdf":
              return `What are the main findings from ${doc.name}?`;
            case "docx":
              return `Can you summarize the key points from ${doc.name}?`;
            case "pptx":
              return `What are the core messages presented in ${doc.name}?`;
            default:
              return `What insights can we gather from ${doc.name}?`;
          }
        }).slice(0, 2);
        
        questions = [...questions, ...docQuestions];
      }
      
      // Ensure we always have at least one question, even if nothing is selected
      if (questions.length === 0) {
        questions = ["Please select and process data sources or documents to get tailored questions"];
      }
      
      setSuggestedQuestions(questions.slice(0, 2)); // Limit to 2 questions
    };

    if (isProcessingData || isProcessingDoc) {
      generateQuestions();
    }
  }, [dataSources, documents, isProcessingData, isProcessingDoc]);

  return { suggestedQuestions };
};
