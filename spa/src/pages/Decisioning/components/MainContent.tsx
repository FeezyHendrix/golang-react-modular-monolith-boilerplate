
import React from "react";
import EmptyState from "./EmptyState";
import SuggestedQuestions from "./SuggestedQuestions";
import { DataItem } from "../types";

type MainContentProps = {
  hasAnyItemSelected: boolean;
  isProcessingData: boolean;
  isProcessingDoc: boolean;
  setMessage: (message: string) => void;
  dataSources: DataItem[];
  documents: DataItem[];
};

const MainContent: React.FC<MainContentProps> = ({
  hasAnyItemSelected,
  isProcessingData,
  isProcessingDoc,
  setMessage,
  dataSources,
  documents,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {!hasAnyItemSelected ? (
        <EmptyState />
      ) : (
        <div className="w-full max-w-2xl space-y-6">
          {hasAnyItemSelected && (isProcessingData || isProcessingDoc) && (
            <SuggestedQuestions 
              setMessage={setMessage}
              dataSources={dataSources}
              documents={documents}
              isProcessingData={isProcessingData}
              isProcessingDoc={isProcessingDoc}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MainContent;
