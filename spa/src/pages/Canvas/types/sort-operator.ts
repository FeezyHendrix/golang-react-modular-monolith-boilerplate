
import { OperatorData, OperatorStatus, OperatorType, SortDirection, SortField } from './common';

// Define interface for Sort operator
export interface SortOperatorData extends OperatorData {
  type: OperatorType.SORT;
  sortFields: SortField[];
}
