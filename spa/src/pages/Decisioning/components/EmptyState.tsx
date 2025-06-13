
import React from "react";
import { Lightbulb } from "lucide-react";

const EmptyState: React.FC = () => {
  return (
    <div>
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <Lightbulb className="h-8 w-8 text-blue-400" />
      </div>
      <h2 className="text-lg font-medium mb-2">
        Select your data sources and documents to begin
      </h2>
      <p className="text-muted-foreground max-w-md">
        Add data sources and documents from the left sidebar to analyze and generate insights.
      </p>
    </div>
  );
};

export default EmptyState;
