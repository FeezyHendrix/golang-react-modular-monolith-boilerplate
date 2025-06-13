
import React, { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { OperatorData, OperatorType } from '../../types';
import ConfigPanelSaveButton from './ConfigPanelSaveButton';
import ConfigPanelHeader from './ConfigPanelHeader';

// Type imports for the specific operators
import { SourceOperatorData } from '../../types/source-operator';
import { FilterOperatorData } from '../../types/filter-operator';
import { JoinOperatorData } from '../../types/join-operator';
import { AggregateOperatorData } from '../../types/aggregate-operator';
import { SelectOperatorData } from '../../types/select-operator';
import { UnionOperatorData } from '../../types/union-operator';
import { SortOperatorData } from '../../types/sort-operator';
import { LimitOperatorData } from '../../types/limit-operator';
import { AnalyzeTextOperatorData } from '../../types/analyze-operator';

// Component imports
import SourceConfig from '../config/SourceConfig';
import FilterConfig from '../config/FilterConfig';
import JoinConfig from '../config/JoinConfig';
import AggregateConfig from '../config/AggregateConfig';
import SelectConfig from '../config/SelectConfig';
import UnionConfig from '../config/UnionConfig';
import SortConfig from '../config/SortConfig';
import LimitConfig from '../config/LimitConfig';
import AnalyzeTextConfig from '../config/AnalyzeTextConfig';

interface ConfigPanelContentProps {
  operator: OperatorData;
  updateOperator: (operator: OperatorData) => void;
  onClose: () => void;
  connectedOperators?: OperatorData[];
  getAvailableColumns?: (operatorId: string) => string[];
  isLoading: boolean;
  progress: number;
  onSave: () => void;
  componentHandlesSave: boolean;
  isPoppedOut: boolean;
  onTogglePop: () => void;
}

const ConfigPanelContent = React.memo(({ 
  operator,
  updateOperator,
  onClose,
  connectedOperators = [],
  getAvailableColumns = () => [],
  isLoading,
  progress,
  onSave,
  componentHandlesSave,
  isPoppedOut,
  onTogglePop
}: ConfigPanelContentProps) => {
  const configTitle = useMemo(() => `Configure ${operator.type}`, [operator.type]);

  const renderSpecificConfig = () => {
    // Common props without type-specific properties
    const commonProps = {
      onSave,
      connectedOperators,
      getAvailableColumns,
    };

    switch (operator.type) {
      case OperatorType.SOURCE:
        return <SourceConfig 
          operator={operator as SourceOperatorData} 
          onUpdateOperator={updateOperator as (op: SourceOperatorData) => void} 
          {...commonProps} 
        />;
      case OperatorType.FILTER:
        return <FilterConfig 
          operator={operator as FilterOperatorData} 
          onUpdateOperator={updateOperator as (op: FilterOperatorData) => void} 
          {...commonProps} 
        />;
      case OperatorType.JOIN:
        return <JoinConfig 
          operator={operator as JoinOperatorData} 
          onUpdateOperator={updateOperator as (op: JoinOperatorData) => void} 
          {...commonProps} 
        />;
      case OperatorType.AGGREGATE:
        return <AggregateConfig 
          operator={operator as AggregateOperatorData} 
          onUpdateOperator={updateOperator as (op: AggregateOperatorData) => void} 
          {...commonProps} 
        />;
      case OperatorType.SELECT:
        return <SelectConfig 
          operator={operator as SelectOperatorData} 
          onUpdateOperator={updateOperator as (op: SelectOperatorData) => void} 
          {...commonProps} 
        />;
      case OperatorType.UNION:
        return <UnionConfig 
          operator={operator as UnionOperatorData} 
          onUpdateOperator={updateOperator as (op: UnionOperatorData) => void} 
          {...commonProps} 
        />;
      case OperatorType.SORT:
        return <SortConfig 
          operator={operator as SortOperatorData} 
          onUpdateOperator={updateOperator as (op: SortOperatorData) => void} 
          {...commonProps} 
        />;
      case OperatorType.LIMIT:
        return <LimitConfig 
          operator={operator as LimitOperatorData} 
          onUpdateOperator={updateOperator as (op: LimitOperatorData) => void} 
          {...commonProps} 
        />;
      case OperatorType.ANALYZE:
        return <AnalyzeTextConfig 
          operator={operator as AnalyzeTextOperatorData} 
          onUpdateOperator={updateOperator as (op: AnalyzeTextOperatorData) => void} 
          {...commonProps} 
        />;
      default:
        return null;
    }
  };

  return (
    <>
      <ConfigPanelHeader
        title={configTitle}
        onClose={onClose}
        onTogglePop={onTogglePop}
        isPoppedOut={isPoppedOut}
      />
      
      <ScrollArea className="h-[calc(100vh-15rem)] px-4 py-4">
        {isLoading && <Progress value={progress} className="w-full mb-4" />}
        {renderSpecificConfig()}
        
        {!componentHandlesSave && (
          <ConfigPanelSaveButton
            status={operator.status}
            onSave={onSave}
            isLoading={isLoading}
            componentHandlesSave={componentHandlesSave}
          />
        )}
      </ScrollArea>
    </>
  );
});

ConfigPanelContent.displayName = 'ConfigPanelContent';

export default ConfigPanelContent;
