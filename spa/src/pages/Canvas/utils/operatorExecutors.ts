import { TableData } from '../types';

export const executeSourceOperator = (sourceOperator: any): TableData => {
  // Mock data for demonstration
  const mockData: TableData = {
    name: sourceOperator.table || 'Mock Table',
    columns: ['id', 'name', 'email', 'age', 'city', 'country'],
    rows: [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', age: 30, city: 'New York', country: 'USA' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', age: 25, city: 'Los Angeles', country: 'USA' },
      { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 28, city: 'London', country: 'UK' },
      { id: 4, name: 'Bob Williams', email: 'bob.williams@example.com', age: 35, city: 'Paris', country: 'France' },
      { id: 5, name: 'Charlie Brown', email: 'charlie.brown@example.com', age: 22, city: 'Tokyo', country: 'Japan' },
    ],
  };

  // Simulate selecting columns
  if (sourceOperator.selectedColumns && sourceOperator.selectedColumns.length > 0) {
    mockData.columns = sourceOperator.selectedColumns;
    mockData.rows = mockData.rows.map(row => {
      const newRow: any = {};
      sourceOperator.selectedColumns.forEach((col: string) => {
        newRow[col] = row[col];
      });
      return newRow;
    });
  }

  return mockData;
};

// Fix the filter function to handle numeric values properly
export const executeFilterOperator = (filterOperator: any, inputData: TableData): TableData => {
  const { conditions } = filterOperator;
  if (!conditions || conditions.length === 0) {
    return inputData;
  }

  const filteredRows = inputData.rows.filter(row => {
    return conditions.every((condition: any) => {
      const { field, operator, value } = condition;
      const rowValue = row[field];
      
      // Handle different operator types
      switch (operator) {
        case '=':
          return rowValue === value;
        case '!=':
          return rowValue !== value;
        case '>':
          return rowValue > value;
        case '<':
          return rowValue < value;
        case '>=':
          return rowValue >= value;
        case '<=':
          return rowValue <= value;
        case 'LIKE':
          return String(rowValue).toLowerCase().includes(String(value).toLowerCase());
        case 'NOT LIKE':
          return !String(rowValue).toLowerCase().includes(String(value).toLowerCase());
        case 'IN':
          try {
            const valueArr = String(value).split(',').map(v => v.trim());
            return valueArr.includes(String(rowValue));
          } catch (e) {
            console.error('Error parsing IN condition:', e);
            return false;
          }
        case 'NOT IN':
          try {
            const valueArr = String(value).split(',').map(v => v.trim());
            return !valueArr.includes(String(rowValue));
          } catch (e) {
            console.error('Error parsing NOT IN condition:', e);
            return false;
          }
        default:
          console.warn(`Unknown operator: ${operator}`);
          return true;
      }
    });
  });

  return {
    ...inputData,
    rows: filteredRows
  };
};

export const executeJoinOperator = (joinOperator: any, inputData: TableData[]): TableData => {
  if (inputData.length !== 2) {
    console.warn('Join operator requires exactly two input tables.');
    return { columns: [], rows: [] };
  }

  const leftTable = inputData[0];
  const rightTable = inputData[1];
  const { joinType, leftKey, rightKey } = joinOperator;

  if (!leftKey || !rightKey) {
    console.warn('Join keys not specified.');
    return { columns: [], rows: [] };
  }

  let joinedRows: any[] = [];
  let columns = [...new Set([...leftTable.columns, ...rightTable.columns])];

  switch (joinType) {
    case 'INNER':
      joinedRows = leftTable.rows.flatMap(leftRow => {
        return rightTable.rows.map(rightRow => {
          if (leftRow[leftKey] === rightRow[rightKey]) {
            return { ...leftRow, ...rightRow };
          } else {
            return null;
          }
        }).filter(row => row !== null);
      });
      break;
    case 'LEFT':
      joinedRows = leftTable.rows.map(leftRow => {
        const matchingRightRow = rightTable.rows.find(rightRow => leftRow[leftKey] === rightRow[rightKey]);
        return { ...leftRow, ...(matchingRightRow || {}) };
      });
      break;
    case 'RIGHT':
      joinedRows = rightTable.rows.map(rightRow => {
        const matchingLeftRow = leftTable.rows.find(leftRow => leftRow[leftKey] === rightRow[rightKey]);
        return { ...(matchingLeftRow || {}), ...rightRow };
      });
      break;
    case 'FULL':
      const leftJoined = leftTable.rows.map(leftRow => {
        const matchingRightRow = rightTable.rows.find(rightRow => leftRow[leftKey] === rightRow[rightKey]);
        return { ...leftRow, ...(matchingRightRow || {}) };
      });
      const rightJoined = rightTable.rows.map(rightRow => {
        const matchingLeftRow = leftTable.rows.find(leftRow => leftRow[leftKey] === rightRow[rightKey]);
        return { ...(matchingLeftRow || {}), ...rightRow };
      });
      joinedRows = [...leftJoined, ...rightJoined];
      break;
    default:
      console.warn('Unknown join type. Defaulting to INNER.');
      break;
  }

  return {
    columns: columns,
    rows: joinedRows
  };
};

export const executeAggregateOperator = (aggregateOperator: any, inputData: TableData): TableData => {
  const { groupByFields, aggregations } = aggregateOperator;

  if (!groupByFields || groupByFields.length === 0) {
    console.warn('No group by fields specified.');
    return inputData;
  }

  if (!aggregations || aggregations.length === 0) {
    console.warn('No aggregations specified.');
    return inputData;
  }

  // Group data by the specified fields
  const groupedData = inputData.rows.reduce((acc: any, row: any) => {
    const key = groupByFields.map((field: string) => row[field]).join('-');
    if (!acc[key]) {
      acc[key] = { group: {}, rows: [] };
      groupByFields.forEach((field: string) => {
        acc[key].group[field] = row[field];
      });
    }
    acc[key].rows.push(row);
    return acc;
  }, {});

  // Perform aggregations on each group
  const aggregatedRows = Object.values(groupedData).map((groupData: any) => {
    const aggregatedRow: any = { ...groupData.group };
    aggregations.forEach((agg: any) => {
      const { field, function: func, alias } = agg;
      let aggregatedValue;

      switch (func) {
        case 'COUNT':
          aggregatedValue = groupData.rows.length;
          break;
        case 'SUM':
          aggregatedValue = groupData.rows.reduce((sum: number, row: any) => sum + row[field], 0);
          break;
        case 'AVG':
          aggregatedValue = groupData.rows.reduce((sum: number, row: any) => sum + row[field], 0) / groupData.rows.length;
          break;
        case 'MIN':
          aggregatedValue = Math.min(...groupData.rows.map((row: any) => row[field]));
          break;
        case 'MAX':
          aggregatedValue = Math.max(...groupData.rows.map((row: any) => row[field]));
          break;
        default:
          console.warn(`Unknown aggregation function: ${func}`);
          aggregatedValue = null;
      }

      aggregatedRow[alias || `${func}(${field})`] = aggregatedValue;
    });
    return aggregatedRow;
  });

  // Define new columns
  const newColumns = [...groupByFields];
  aggregations.forEach((agg: any) => {
    newColumns.push(agg.alias || `${agg.function}(${agg.field})`);
  });

  return {
    columns: newColumns,
    rows: aggregatedRows
  };
};

export const executeSelectOperator = (selectOperator: any, inputData: TableData): TableData => {
  if (!selectOperator.selectedColumns || selectOperator.selectedColumns.length === 0) {
    console.warn('No columns selected.');
    return inputData;
  }

  const selectedColumns = selectOperator.selectedColumns;

  // Filter rows to only include selected columns
  const newRows = inputData.rows.map(row => {
    const newRow: any = {};
    selectedColumns.forEach((col: string) => {
      if (row.hasOwnProperty(col)) {
        newRow[col] = row[col];
      }
    });
    return newRow;
  });

  return {
    columns: selectedColumns,
    rows: newRows
  };
};

// Fix the union operator to handle distinct property properly
export const executeUnionOperator = (unionOperator: any, inputData: TableData[]): TableData => {
  if (inputData.length === 0) {
    return { columns: [], rows: [] };
  }
  
  let allColumns = new Set<string>();
  inputData.forEach(data => {
    data.columns.forEach(col => allColumns.add(col));
  });

  const columns = Array.from(allColumns);
  
  // Create a combined dataset
  let combinedRows: any[] = [];
  inputData.forEach(data => {
    data.rows.forEach(row => {
      const newRow: any = {};
      columns.forEach(col => {
        newRow[col] = row[col] !== undefined ? row[col] : null;
      });
      combinedRows.push(newRow);
    });
  });

  // Handle distinct flag if it exists
  const isDistinct = unionOperator.distinct === true;
  
  if (isDistinct) {
    // Use a map to track unique rows
    const uniqueRows = new Map();
    combinedRows.forEach(row => {
      const key = JSON.stringify(row);
      uniqueRows.set(key, row);
    });
    combinedRows = Array.from(uniqueRows.values());
  }

  return {
    columns,
    rows: combinedRows
  };
};

export const executeSortOperator = (sortOperator: any, inputData: TableData): TableData => {
  const { sortFields } = sortOperator;

  if (!sortFields || sortFields.length === 0) {
    console.warn('No sort fields specified.');
    return inputData;
  }

  const sortedRows = [...inputData.rows].sort((a: any, b: any) => {
    for (const sortField of sortFields) {
      const { field, direction } = sortField;
      const aValue = a[field];
      const bValue = b[field];

      if (aValue < bValue) {
        return direction === 'ASC' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ASC' ? 1 : -1;
      }
    }
    return 0;
  });

  return {
    ...inputData,
    rows: sortedRows
  };
};

export const executeLimitOperator = (limitOperator: any, inputData: TableData): TableData => {
  const { limit, direction } = limitOperator;

  if (!limit) {
    console.warn('No limit specified.');
    return inputData;
  }

  const limitedRows = direction === 'bottom' ? inputData.rows.slice(-limit) : inputData.rows.slice(0, limit);

  return {
    ...inputData,
    rows: limitedRows
  };
};

export const executeAnalyzeTextOperator = (analyzeTextOperator: any, inputData: TableData): TableData => {
    const { analysisType, textField } = analyzeTextOperator;

    if (!analysisType || !textField) {
        console.warn('Analysis type or text field not specified.');
        return inputData;
    }

    const analyzedRows = inputData.rows.map(row => {
        const text = row[textField];

        if (!text) {
            console.warn(`Text field ${textField} is empty for row ${row.id}`);
            return row;
        }

        let analysisResult = `Mock ${analysisType} analysis for "${text}"`;

        return {
            ...row,
            [`${textField}_${analysisType}`]: analysisResult
        };
    });

    const newColumn = `${textField}_${analysisType}`;
    const updatedColumns = [...inputData.columns, newColumn];

    return {
        columns: updatedColumns,
        rows: analyzedRows
    };
};
