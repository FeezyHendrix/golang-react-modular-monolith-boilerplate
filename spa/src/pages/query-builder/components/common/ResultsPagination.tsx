
import React from "react";
import { Button } from "@/components/ui/button";

interface ResultsPaginationProps {
  currentPage: number;
  totalPages: number;
  resultsLength: number;
  itemsPerPage: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const ResultsPagination: React.FC<ResultsPaginationProps> = ({
  currentPage,
  totalPages,
  resultsLength,
  itemsPerPage,
  onPreviousPage,
  onNextPage,
}) => {
  if (resultsLength <= itemsPerPage) return null;

  return (
    <div className="flex justify-between items-center mt-4 p-2">
      <div className="text-sm text-muted-foreground">
        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, resultsLength)} of {resultsLength} results
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ResultsPagination;
