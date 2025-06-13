
import React from 'react';
import { Button } from "@/components/ui/button";

export const DocumentationTab = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Documentation</h2>
      <div className="space-y-4">
        <section>
          <h3 className="text-xl font-semibold mb-2">Quick Start</h3>
          <p>Learn how to use the Query Builder to create and manage your queries.</p>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-2">Operators</h3>
          <p>Explore the available operators:</p>
          <ul className="list-disc pl-5 mt-2">
            <p>Filter {'>'} Filter your data based on conditions</p>
            <p>Join {'>'} Combine multiple data sources</p>
            <p>Sort {'>'} Order your results</p>
            <p>Limit {'>'} Control the number of results</p>
          </ul>
        </section>

        <Button variant="outline" className="mt-4">
          View Full Documentation
        </Button>
      </div>
    </div>
  );
};

export default DocumentationTab;
