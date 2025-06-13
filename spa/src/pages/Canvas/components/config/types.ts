
import { 
  OperatorData, 
  FilterOperatorData, 
  JoinOperatorData, 
  AggregateOperatorData, 
  SortOperatorData, 
  SelectOperatorData, 
  UnionOperatorData, 
  LimitOperatorData,
  SourceOperatorData,
  AnalyzeTextOperatorData
} from '../../types';

export interface BaseConfigProps<T extends OperatorData> {
  operator: T;
  onUpdateOperator: (operator: T) => void;
  connectedOperators?: OperatorData[];
  getAvailableColumns?: (operatorId: string) => string[];
  onSave?: () => void;
}

export interface SourceConfigProps extends BaseConfigProps<SourceOperatorData> {}
export interface FilterConfigProps extends BaseConfigProps<FilterOperatorData> {}
export interface JoinConfigProps extends BaseConfigProps<JoinOperatorData> {}
export interface AggregateConfigProps extends BaseConfigProps<AggregateOperatorData> {}
export interface SelectConfigProps extends BaseConfigProps<SelectOperatorData> {}
export interface UnionConfigProps extends BaseConfigProps<UnionOperatorData> {}
export interface SortConfigProps extends BaseConfigProps<SortOperatorData> {}
export interface LimitConfigProps extends BaseConfigProps<LimitOperatorData> {}
export interface AnalyzeTextConfigProps extends BaseConfigProps<AnalyzeTextOperatorData> {}
