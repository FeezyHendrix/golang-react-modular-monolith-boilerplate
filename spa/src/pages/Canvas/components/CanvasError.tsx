
import React from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface CanvasErrorProps {
  error: string | null;
}

const CanvasError: React.FC<CanvasErrorProps> = ({ error }) => {
  if (!error) return null;

  // Check if the error is "Join keys are not defined" but there are configured join operators
  // If we add other specific error handling logic, we can extend this function
  const shouldSkipError = (errorMessage: string) => {
    // Check for join keys error but the operator is actually configured
    if (errorMessage.includes("Join keys are not defined") && 
        document.querySelector('.operator-join.configured')) {
      return true;
    }
    return false;
  };

  // Skip showing the error if it's a false positive
  if (shouldSkipError(error)) return null;

  // Get a helpful explanation based on the error message
  const getErrorHelp = () => {
    if (error.includes("requires an input") || error.includes("incoming connection")) {
      return "This operator needs data from another operator. Connect it to an upstream operator first.";
    }
    if (error.includes("requires at least two inputs")) {
      return "Join operators need two sources to compare. Connect two upstream operators to this join.";
    }
    if (error.includes("map is not a function")) {
      return "Expected an array of data but received something else. Check your operator connections.";
    }
    if (error.includes("Join keys are not defined")) {
      return "You need to specify which columns to join on in your join operator configuration.";
    }
    return "Review your workflow structure and operator configurations to resolve this error.";
  };

  return (
    <Alert variant="destructive" className="mb-4 pr-12 relative">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center">
        {error}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-2">
                <HelpCircle size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{getErrorHelp()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDescription>
    </Alert>
  );
};

export default CanvasError;
