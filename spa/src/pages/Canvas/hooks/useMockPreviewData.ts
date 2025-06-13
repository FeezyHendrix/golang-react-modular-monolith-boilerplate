import { useCallback } from 'react';
import { OperatorType, TableData } from '../types';

export function useMockPreviewData() {
  // Mock data generators for different types of operators
  const generateSourceData = useCallback((): TableData => {
    return {
      columns: ['id', 'name', 'email', 'age', 'country', 'created_at'],
      rows: [
        { id: 1, name: 'John Doe', email: 'john@example.com', age: 35, country: 'USA', created_at: '2023-01-15' },
        { id: 2, name: 'Alice Smith', email: 'alice@example.com', age: 28, country: 'Canada', created_at: '2023-02-23' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 42, country: 'UK', created_at: '2023-03-10' },
        { id: 4, name: 'Emily Brown', email: 'emily@example.com', age: 31, country: 'Australia', created_at: '2023-04-05' },
        { id: 5, name: 'Michael Wilson', email: 'michael@example.com', age: 45, country: 'USA', created_at: '2023-01-20' },
      ]
    };
  }, []);

  const generateFilterData = useCallback((): TableData => {
    return {
      columns: ['id', 'name', 'email', 'age', 'country', 'created_at'],
      rows: [
        { id: 1, name: 'John Doe', email: 'john@example.com', age: 35, country: 'USA', created_at: '2023-01-15' },
        { id: 5, name: 'Michael Wilson', email: 'michael@example.com', age: 45, country: 'USA', created_at: '2023-01-20' },
      ]
    };
  }, []);

  const generateJoinData = useCallback((): TableData => {
    return {
      columns: ['id', 'name', 'email', 'order_id', 'product', 'amount', 'date'],
      rows: [
        { id: 1, name: 'John Doe', email: 'john@example.com', order_id: 101, product: 'Laptop', amount: 999, date: '2023-06-15' },
        { id: 2, name: 'Alice Smith', email: 'alice@example.com', order_id: 102, product: 'Phone', amount: 699, date: '2023-07-23' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', order_id: 103, product: 'Headphones', amount: 149, date: '2023-08-10' },
      ]
    };
  }, []);

  const generateAggregateData = useCallback((): TableData => {
    return {
      columns: ['country', 'count', 'avg_age', 'min_age', 'max_age'],
      rows: [
        { country: 'USA', count: 2, avg_age: 40, min_age: 35, max_age: 45 },
        { country: 'Canada', count: 1, avg_age: 28, min_age: 28, max_age: 28 },
        { country: 'UK', count: 1, avg_age: 42, min_age: 42, max_age: 42 },
        { country: 'Australia', count: 1, avg_age: 31, min_age: 31, max_age: 31 },
      ]
    };
  }, []);

  const generateUnionData = useCallback((): TableData => {
    return {
      columns: ['id', 'name', 'email', 'country', 'source'],
      rows: [
        { id: 1, name: 'John Doe', email: 'john@example.com', country: 'USA', source: 'customers' },
        { id: 2, name: 'Alice Smith', email: 'alice@example.com', country: 'Canada', source: 'customers' },
        { id: 101, name: 'Sarah Jones', email: 'sarah@example.com', country: 'France', source: 'leads' },
        { id: 102, name: 'David Miller', email: 'david@example.com', country: 'Germany', source: 'leads' },
      ]
    };
  }, []);

  const generateSortData = useCallback((): TableData => {
    return {
      columns: ['id', 'name', 'email', 'age', 'country', 'created_at'],
      rows: [
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 42, country: 'UK', created_at: '2023-03-10' },
        { id: 4, name: 'Emily Brown', email: 'emily@example.com', age: 31, country: 'Australia', created_at: '2023-04-05' },
        { id: 1, name: 'John Doe', email: 'john@example.com', age: 35, country: 'USA', created_at: '2023-01-15' },
        { id: 5, name: 'Michael Wilson', email: 'michael@example.com', age: 45, country: 'USA', created_at: '2023-01-20' },
        { id: 2, name: 'Alice Smith', email: 'alice@example.com', age: 28, country: 'Canada', created_at: '2023-02-23' },
      ]
    };
  }, []);

  const generateLimitData = useCallback((): TableData => {
    return {
      columns: ['id', 'name', 'email', 'age', 'country', 'created_at'],
      rows: [
        { id: 1, name: 'John Doe', email: 'john@example.com', age: 35, country: 'USA', created_at: '2023-01-15' },
        { id: 2, name: 'Alice Smith', email: 'alice@example.com', age: 28, country: 'Canada', created_at: '2023-02-23' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 42, country: 'UK', created_at: '2023-03-10' },
      ]
    };
  }, []);

  const generateAnalyzeData = useCallback((): TableData => {
    return {
      columns: ['text', 'sentiment', 'confidence', 'entities', 'keywords'],
      rows: [
        {
          text: 'I absolutely love this product! Best purchase ever.',
          sentiment: 'Positive',
          confidence: 0.95,
          entities: 'product (PRODUCT)',
          keywords: 'love, best, purchase'
        },
        {
          text: 'The service was average but the staff was friendly.',
          sentiment: 'Neutral',
          confidence: 0.75,
          entities: 'service (SERVICE), staff (PERSON)',
          keywords: 'service, average, staff, friendly'
        },
        {
          text: 'Terrible experience, would not recommend to anyone.',
          sentiment: 'Negative',
          confidence: 0.88,
          entities: 'experience (EVENT)',
          keywords: 'terrible, experience, recommend'
        },
      ]
    };
  }, []);

  const generateSelectData = useCallback((): TableData => {
    return {
      columns: ['name', 'email', 'country'],
      rows: [
        { name: 'John Doe', email: 'john@example.com', country: 'USA' },
        { name: 'Alice Smith', email: 'alice@example.com', country: 'Canada' },
        { name: 'Bob Johnson', email: 'bob@example.com', country: 'UK' },
        { name: 'Emily Brown', email: 'emily@example.com', country: 'Australia' },
        { name: 'Michael Wilson', email: 'michael@example.com', country: 'USA' },
      ]
    };
  }, []);

  // Map operator types to their data generators
  const generateMockData = useCallback((type: OperatorType, options?: any): TableData => {
    // Enhance the generateMockData function to accept parameters for generating more realistic data
    switch (type) {
      case 'source':
        return generateSourceData();
      case 'filter':
        return generateFilterData();
      case 'join':
        return generateJoinData();
      case 'select':
        return generateSelectData();
      case 'aggregate':
        return generateAggregateData();
      case 'union':
        return generateUnionData();
      case 'sort':
        return generateSortData();
      case 'limit':
        return generateLimitData();
      case 'analyze':
        return generateAnalyzeData();
      default:
        return generateSourceData(); // Default to source data
    }
  }, [
    generateSourceData,
    generateFilterData,
    generateJoinData,
    generateSelectData,
    generateAggregateData,
    generateUnionData,
    generateSortData,
    generateLimitData,
    generateAnalyzeData
  ]);

  // Add functions to perform actual data operations
  
  // Filter data based on conditions
  const applyFilter = useCallback((inputData: TableData, conditions: any[]): TableData => {
    if (!conditions || conditions.length === 0) return inputData;
    
    const filteredRows = inputData.rows.filter(row => {
      return conditions.every(condition => {
        const { field, operator, value } = condition;
        const fieldValue = row[field];
        
        switch (operator) {
          case '=':
          case 'equals':
            return fieldValue === value;
          case '!=':
          case 'not equals':
            return fieldValue !== value;
          case '>':
          case 'greater than':
            return fieldValue > value;
          case '<':
          case 'less than':
            return fieldValue < value;
          case '>=':
          case 'greater than or equals':
            return fieldValue >= value;
          case '<=':
          case 'less than or equals':
            return fieldValue <= value;
          case 'contains':
            return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
          case 'starts with':
            return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase());
          case 'ends with':
            return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase());
          default:
            return true;
        }
      });
    });
    
    return {
      columns: inputData.columns,
      rows: filteredRows
    };
  }, []);
  
  // Join two tables
  const joinTables = useCallback((leftTable: TableData, rightTable: TableData, options: any): TableData => {
    const { type, leftKey, rightKey } = options;
    
    const joinedRows: any[] = [];
    const joinType = type || 'INNER';
    
    const rightKeyIndex: Record<string, any[]> = {};
    
    // Index the right table by the join key for efficient lookup
    rightTable.rows.forEach(rightRow => {
      const keyValue = String(rightRow[rightKey]);
      if (!rightKeyIndex[keyValue]) {
        rightKeyIndex[keyValue] = [];
      }
      rightKeyIndex[keyValue].push(rightRow);
    });
    
    // Create column names with table prefixes to avoid collisions
    const leftColumns = leftTable.columns.map(col => `left_${col}`);
    const rightColumns = rightTable.columns.map(col => `right_${col}`);
    const joinedColumns = [...leftColumns, ...rightColumns];
    
    // Perform the join based on the join type
    if (joinType === 'INNER' || joinType === 'LEFT') {
      leftTable.rows.forEach(leftRow => {
        const keyValue = String(leftRow[leftKey]);
        const matchingRightRows = rightKeyIndex[keyValue] || [];
        
        if (matchingRightRows.length > 0) {
          // We have matches - create joined rows
          matchingRightRows.forEach(rightRow => {
            const joinedRow: Record<string, any> = {};
            
            // Add left table columns with prefix
            leftTable.columns.forEach(col => {
              joinedRow[`left_${col}`] = leftRow[col];
            });
            
            // Add right table columns with prefix
            rightTable.columns.forEach(col => {
              joinedRow[`right_${col}`] = rightRow[col];
            });
            
            joinedRows.push(joinedRow);
          });
        } else if (joinType === 'LEFT') {
          // LEFT JOIN: Include the left row with nulls for right side
          const joinedRow: Record<string, any> = {};
          
          // Add left table columns with prefix
          leftTable.columns.forEach(col => {
            joinedRow[`left_${col}`] = leftRow[col];
          });
          
          // Add right table columns as null
          rightTable.columns.forEach(col => {
            joinedRow[`right_${col}`] = null;
          });
          
          joinedRows.push(joinedRow);
        }
      });
    } else if (joinType === 'RIGHT') {
      rightTable.rows.forEach(rightRow => {
        const keyValue = String(rightRow[rightKey]);
        const leftRows = [];
        
        // Find matching left rows
        for (const leftRow of leftTable.rows) {
          if (String(leftRow[leftKey]) === keyValue) {
            leftRows.push(leftRow);
          }
        }
        
        if (leftRows.length > 0) {
          // We have matches - create joined rows
          leftRows.forEach(leftRow => {
            const joinedRow: Record<string, any> = {};
            
            // Add left table columns with prefix
            leftTable.columns.forEach(col => {
              joinedRow[`left_${col}`] = leftRow[col];
            });
            
            // Add right table columns with prefix
            rightTable.columns.forEach(col => {
              joinedRow[`right_${col}`] = rightRow[col];
            });
            
            joinedRows.push(joinedRow);
          });
        } else {
          // RIGHT JOIN: Include the right row with nulls for left side
          const joinedRow: Record<string, any> = {};
          
          // Add left table columns as null
          leftTable.columns.forEach(col => {
            joinedRow[`left_${col}`] = null;
          });
          
          // Add right table columns with prefix
          rightTable.columns.forEach(col => {
            joinedRow[`right_${col}`] = rightRow[col];
          });
          
          joinedRows.push(joinedRow);
        }
      });
    } else if (joinType === 'FULL') {
      // First do left join
      leftTable.rows.forEach(leftRow => {
        const keyValue = String(leftRow[leftKey]);
        const matchingRightRows = rightKeyIndex[keyValue] || [];
        
        if (matchingRightRows.length > 0) {
          // We have matches - create joined rows
          matchingRightRows.forEach(rightRow => {
            const joinedRow: Record<string, any> = {};
            
            leftTable.columns.forEach(col => {
              joinedRow[`left_${col}`] = leftRow[col];
            });
            
            rightTable.columns.forEach(col => {
              joinedRow[`right_${col}`] = rightRow[col];
            });
            
            joinedRows.push(joinedRow);
          });
        } else {
          // No match - add nulls for right side
          const joinedRow: Record<string, any> = {};
          
          leftTable.columns.forEach(col => {
            joinedRow[`left_${col}`] = leftRow[col];
          });
          
          rightTable.columns.forEach(col => {
            joinedRow[`right_${col}`] = null;
          });
          
          joinedRows.push(joinedRow);
        }
      });
      
      // Then add right rows that don't have a match on the left
      const leftKeyValues = new Set(leftTable.rows.map(row => String(row[leftKey])));
      
      rightTable.rows.forEach(rightRow => {
        const keyValue = String(rightRow[rightKey]);
        
        if (!leftKeyValues.has(keyValue)) {
          const joinedRow: Record<string, any> = {};
          
          leftTable.columns.forEach(col => {
            joinedRow[`left_${col}`] = null;
          });
          
          rightTable.columns.forEach(col => {
            joinedRow[`right_${col}`] = rightRow[col];
          });
          
          joinedRows.push(joinedRow);
        }
      });
    }
    
    return {
      columns: joinedColumns,
      rows: joinedRows
    };
  }, []);
  
  // Union multiple tables
  const unionTables = useCallback((tables: TableData[]): TableData => {
    if (tables.length === 0) return { columns: [], rows: [] };
    if (tables.length === 1) return tables[0];
    
    // Get a superset of all columns from all tables
    const allColumns = new Set<string>();
    tables.forEach(table => {
      table.columns.forEach(col => allColumns.add(col));
    });
    
    const columns = Array.from(allColumns);
    const rows: any[] = [];
    
    // Add rows from all tables, filling in missing columns with null
    tables.forEach(table => {
      table.rows.forEach(row => {
        const unionRow: Record<string, any> = {};
        
        // Initialize all columns to null
        columns.forEach(col => {
          unionRow[col] = null;
        });
        
        // Fill in values from this row
        table.columns.forEach(col => {
          unionRow[col] = row[col];
        });
        
        rows.push(unionRow);
      });
    });
    
    return { columns, rows };
  }, []);
  
  // Select specific columns
  const selectColumns = useCallback((inputData: TableData, selectedColumns: string[]): TableData => {
    if (!selectedColumns || selectedColumns.length === 0) return inputData;
    
    // Filter columns that exist in the input data
    const validColumns = selectedColumns.filter(col => inputData.columns.includes(col));
    
    // Map rows to only include selected columns
    const rows = inputData.rows.map(row => {
      const newRow: Record<string, any> = {};
      validColumns.forEach(col => {
        newRow[col] = row[col];
      });
      return newRow;
    });
    
    return {
      columns: validColumns,
      rows
    };
  }, []);
  
  // Aggregate data (group by and aggregations)
  const aggregateData = useCallback((inputData: TableData, options: any): TableData => {
    const { groupBy = [], aggregations = [] } = options;
    
    if (groupBy.length === 0 && aggregations.length === 0) {
      return inputData;
    }
    
    // Group the data
    const groups: Record<string, any[]> = {};
    
    inputData.rows.forEach(row => {
      // Create a key for this row's group
      const groupKey = groupBy.map(col => String(row[col])).join('||');
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(row);
    });
    
    // Build result columns: group by columns + aggregation columns
    const resultColumns = [...groupBy];
    const aggregationColumns: string[] = [];
    
    aggregations.forEach(agg => {
      const alias = agg.alias || `${agg.function}_${agg.column}`;
      resultColumns.push(alias);
      aggregationColumns.push(alias);
    });
    
    // Calculate aggregations for each group
    const resultRows: any[] = [];
    
    Object.entries(groups).forEach(([groupKey, groupRows]) => {
      const resultRow: Record<string, any> = {};
      
      // Add group by columns
      if (groupKey) {
        const groupValues = groupKey.split('||');
        groupBy.forEach((col, index) => {
          resultRow[col] = groupRows[0][col]; // Take the value from the first row in the group
        });
      }
      
      // Calculate aggregations
      aggregations.forEach(agg => {
        const alias = agg.alias || `${agg.function}_${agg.column}`;
        
        switch (agg.function.toLowerCase()) {
          case 'count':
            resultRow[alias] = groupRows.length;
            break;
          case 'sum':
            resultRow[alias] = groupRows.reduce((sum, row) => {
              const value = parseFloat(row[agg.column]);
              return sum + (isNaN(value) ? 0 : value);
            }, 0);
            break;
          case 'avg':
            resultRow[alias] = groupRows.reduce((sum, row) => {
              const value = parseFloat(row[agg.column]);
              return sum + (isNaN(value) ? 0 : value);
            }, 0) / groupRows.length;
            break;
          case 'min':
            resultRow[alias] = groupRows.reduce((min, row) => {
              const value = parseFloat(row[agg.column]);
              return isNaN(value) ? min : Math.min(min, value);
            }, Infinity);
            break;
          case 'max':
            resultRow[alias] = groupRows.reduce((max, row) => {
              const value = parseFloat(row[agg.column]);
              return isNaN(value) ? max : Math.max(max, value);
            }, -Infinity);
            break;
          default:
            resultRow[alias] = null;
        }
      });
      
      resultRows.push(resultRow);
    });
    
    return {
      columns: resultColumns,
      rows: resultRows
    };
  }, []);
  
  // Sort data based on column and direction
  const sortData = useCallback((inputData: TableData, sortFields: any[]): TableData => {
    if (!sortFields || sortFields.length === 0) return inputData;
    
    const sortedRows = [...inputData.rows].sort((a, b) => {
      // Compare based on each sort field in order
      for (const sort of sortFields) {
        const { field, direction } = sort;
        const dir = direction && direction.toUpperCase() === 'DESC' ? -1 : 1;
        
        if (a[field] < b[field]) return -1 * dir;
        if (a[field] > b[field]) return 1 * dir;
      }
      return 0;
    });
    
    return {
      columns: inputData.columns,
      rows: sortedRows
    };
  }, []);
  
  // Limit the number of rows
  const limitData = useCallback((inputData: TableData, limit: number): TableData => {
    if (!limit || limit <= 0) return inputData;
    
    return {
      columns: inputData.columns,
      rows: inputData.rows.slice(0, limit)
    };
  }, []);
  
  // Simulate text analysis
  const analyzeText = useCallback((inputData: TableData, options: any): TableData => {
    const { analysisType, textField } = options;
    
    if (!textField || !inputData.columns.includes(textField)) {
      throw new Error(`Text field "${textField}" not found in input data`);
    }
    
    // Generate analysis results based on the type
    const analysisColumn = `${analysisType}_result`;
    const resultColumns = [...inputData.columns, analysisColumn];
    
    const resultRows = inputData.rows.map(row => {
      const text = String(row[textField] || '');
      const resultRow = { ...row };
      
      switch (analysisType) {
        case 'sentiment':
          // Simulate sentiment analysis
          const sentiments = ['Positive', 'Neutral', 'Negative'];
          resultRow[analysisColumn] = sentiments[Math.floor(Math.random() * sentiments.length)];
          break;
        case 'keyword':
          // Simulate keyword extraction
          const words = text.split(/\s+/).filter(w => w.length > 3);
          const keywords = words.length > 0
            ? words.slice(0, Math.min(3, words.length)).join(', ')
            : 'No keywords found';
          resultRow[analysisColumn] = keywords;
          break;
        case 'entity':
          // Simulate entity recognition
          const entities = ['Person', 'Organization', 'Location', 'Date'];
          resultRow[analysisColumn] = entities[Math.floor(Math.random() * entities.length)];
          break;
        default:
          resultRow[analysisColumn] = 'Analysis not supported';
      }
      
      return resultRow;
    });
    
    return {
      columns: resultColumns,
      rows: resultRows
    };
  }, []);
  
  return {
    generateMockData,
    applyFilter,
    joinTables,
    unionTables,
    selectColumns,
    aggregateData,
    sortData,
    limitData,
    analyzeText
  };
}
