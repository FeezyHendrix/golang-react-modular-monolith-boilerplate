
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const QueryBuilder = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Card 
          className="flex-1 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate("/query-builder/sql")}
        >
          SQL Query
        </Card>
  
        <Card 
          className="flex-1 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate("/query-builder/python")}
        >
          Python
        </Card>
      </div>
    </div>
  );
};

export default QueryBuilder;
