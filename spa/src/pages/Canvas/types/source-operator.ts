
import { OperatorData, OperatorStatus, OperatorType } from './common';

// Define interface for Source operator
export interface SourceOperatorData extends OperatorData {
  type: OperatorType.SOURCE;
  dataSource?: {
    type: string;
    name?: string;
    size?: number;
    connection?: string | null;
  };
  script?: {
    type: string;
    content: string;
  };
  availableColumns?: string[];
  selectedColumns?: string[];
  scriptResults?: any[];
  table?: string; // Added for backward compatibility
  consoleOutput?: string; // Store console output
}
