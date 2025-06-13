
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  searchTerm: string;
  onClearSearch: () => void;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  searchTerm,
  onClearSearch,
  message
}) => {
  return (
    <div className="text-center p-8 border rounded-md">
      <h3 className="text-lg font-medium mb-2">No results found</h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm 
          ? "No items match your search criteria" 
          : message}
      </p>
      {searchTerm && (
        <Button 
          variant="outline"
          onClick={onClearSearch}
        >
          Clear Search
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
