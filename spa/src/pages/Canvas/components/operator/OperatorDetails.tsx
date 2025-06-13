
import React from 'react';
import { 
  OperatorData, 
  OperatorType,
  FilterOperatorData,
  JoinOperatorData,
  AggregateOperatorData,
  SourceOperatorData,
  LimitOperatorData,
  SortOperatorData,
  AnalyzeTextOperatorData
} from '../../types';

interface OperatorDetailsProps {
  operator: OperatorData;
}

const OperatorDetails: React.FC<OperatorDetailsProps> = ({ operator }) => {
  switch (operator.type) {
    case 'source': {
      const sourceOp = operator as SourceOperatorData;
      if (sourceOp.table) {
        return (
          <>
            <p className="mb-1">Table: <strong>{sourceOp.table}</strong></p>
            {sourceOp.selectedColumns && sourceOp.selectedColumns.length > 0 && (
              <p className="truncate">
                Columns: {sourceOp.selectedColumns.length}
              </p>
            )}
          </>
        );
      }
      return <p>Select a table</p>;
    }
    
    case 'join': {
      const joinOp = operator as JoinOperatorData;
      return (
        <>
          <p className="mb-1">Type: <strong>{joinOp.joinType || 'INNER'}</strong></p>
          {joinOp.leftKey && joinOp.rightKey && (
            <p className="text-xs truncate">
              Keys: {joinOp.leftKey} = {joinOp.rightKey}
            </p>
          )}
        </>
      );
    }
    
    case 'filter': {
      const filterOp = operator as FilterOperatorData;
      const conditions = filterOp.conditions || [];
      return (
        <>
          <p className="mb-1">Conditions: <strong>{conditions.length}</strong></p>
          {conditions.length > 0 && (
            <p className="text-xs truncate">
              {conditions[0].field} {conditions[0].operator} {conditions[0].value}
              {conditions.length > 1 ? ` (+${conditions.length - 1} more)` : ''}
            </p>
          )}
        </>
      );
    }
    
    case 'select': {
      const selectOp = operator as any;
      return (
        <>
          <p className="mb-1">Selected columns: <strong>{(selectOp.selectedColumns || []).length}</strong></p>
          {selectOp.selectedColumns && selectOp.selectedColumns.length > 0 && (
            <p className="text-xs truncate">
              {selectOp.selectedColumns.slice(0, 2).join(', ')}
              {selectOp.selectedColumns.length > 2 ? ` (+${selectOp.selectedColumns.length - 2} more)` : ''}
            </p>
          )}
        </>
      );
    }
    
    case 'aggregate': {
      const aggOp = operator as AggregateOperatorData;
      return (
        <>
          <p className="mb-1">Group by: <strong>{(aggOp.groupByFields || []).length}</strong></p>
          <p className="mb-1">Aggregations: <strong>{(aggOp.aggregations || []).length}</strong></p>
        </>
      );
    }
    
    case 'limit': {
      const limitOp = operator as LimitOperatorData;
      return (
        <p>
          Limit: <strong>{limitOp.direction === 'bottom' ? 'Bottom' : 'Top'} {limitOp.limit || 100}</strong> rows
        </p>
      );
    }
    
    case 'sort': {
      const sortOp = operator as SortOperatorData;
      const sortFields = sortOp.sortFields || [];
      return (
        <>
          <p className="mb-1">Sort fields: <strong>{sortFields.length}</strong></p>
          {sortFields.length > 0 && (
            <p className="text-xs truncate">
              {sortFields[0].field} {sortFields[0].direction}
              {sortFields.length > 1 ? ` (+${sortFields.length - 1} more)` : ''}
            </p>
          )}
        </>
      );
    }

    case 'analyze': {
      const analyzeOp = operator as AnalyzeTextOperatorData;
      return (
        <>
          <p className="mb-1">Type: <strong>{analyzeOp.analysisType}</strong></p>
          {analyzeOp.textField && (
            <p className="text-xs truncate">
              Field: {analyzeOp.textField}
            </p>
          )}
        </>
      );
    }
    
    default:
      return null;
  }
};

export default OperatorDetails;
