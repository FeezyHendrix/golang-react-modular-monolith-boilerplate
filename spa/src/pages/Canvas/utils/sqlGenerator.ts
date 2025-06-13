
import { CanvasState, OperatorData, OperatorType } from '../types';

// Helper to find the sources/inputs for an operator
function findInputs(operatorId: string, connections: any[]) {
  return connections
    .filter(conn => conn.targetId === operatorId)
    .map(conn => conn.sourceId);
}

// Helper to build an operator tree for traversal
function buildOperatorTree(canvasState: CanvasState) {
  const { operators, connections } = canvasState;
  
  // Find terminal operators (those with no outgoing connections)
  const outputOperatorIds = operators
    .filter(op => !connections.some(conn => conn.sourceId === op.id))
    .map(op => op.id);
  
  // Build dependency tree
  const tree: Record<string, any> = {};
  
  function addToTree(operatorId: string, visited = new Set<string>()) {
    if (visited.has(operatorId)) {
      throw new Error(`Circular dependency detected for operator ${operatorId}`);
    }
    
    visited.add(operatorId);
    const operator = operators.find(op => op.id === operatorId);
    if (!operator) return null;
    
    const inputs = findInputs(operatorId, connections);
    tree[operatorId] = {
      operator,
      inputs: inputs.map(inputId => addToTree(inputId, new Set(visited)))
    };
    
    return operatorId;
  }
  
  // Process from the terminal operators
  for (const outputId of outputOperatorIds) {
    addToTree(outputId);
  }
  
  return { tree, outputs: outputOperatorIds };
}

// Generate SQL for a specific operator
function generateOperatorSql(
  operatorId: string, 
  tree: Record<string, any>,
  subqueries: Record<string, string> = {}
): string {
  const { operator, inputs } = tree[operatorId];
  const inputSqls = inputs
    ? inputs.filter(Boolean).map((id: string) => 
        subqueries[id] || generateOperatorSql(id, tree, subqueries)
      )
    : [];
  
  // Store generated subquery
  let sql = '';
  
  switch (operator.type) {
    case 'source':
      sql = `SELECT ${operator.columns?.length ? operator.columns.join(', ') : '*'} FROM ${operator.table || 'table_name'}`;
      break;
      
    case 'join':
      if (inputSqls.length < 2) {
        throw new Error('Join operator requires at least two inputs');
      }
      const [left, right] = inputSqls;
      const joinType = operator.joinType?.toUpperCase() || 'INNER';
      const joinCondition = operator.joinKeys?.map(
        key => `a.${key.left} = b.${key.right}`
      ).join(' AND ') || 'a.id = b.id';
      
      sql = `SELECT * FROM (${left}) a ${joinType} JOIN (${right}) b ON ${joinCondition}`;
      break;
      
    case 'filter':
      if (inputSqls.length < 1) {
        throw new Error('Filter operator requires an input');
      }
      const conditions = operator.conditions?.join(' AND ') || '1=1';
      sql = `SELECT * FROM (${inputSqls[0]}) t WHERE ${conditions}`;
      break;
      
    case 'select':
      if (inputSqls.length < 1) {
        throw new Error('Select operator requires an input');
      }
      const columns = operator.columns?.map(col => {
        if (typeof col === 'string') return col;
        return col.alias ? `${col.original} AS ${col.alias}` : col.original;
      }).join(', ') || '*';
      
      sql = `SELECT ${columns} FROM (${inputSqls[0]}) t`;
      break;
      
    case 'aggregate':
      if (inputSqls.length < 1) {
        throw new Error('Aggregate operator requires an input');
      }
      const aggCols = operator.aggregations?.map(agg => 
        `${agg.function.toUpperCase()}(${agg.column})${agg.alias ? ` AS ${agg.alias}` : ''}`
      ).join(', ') || 'COUNT(*) as count';
      
      const groupByCols = operator.groupBy?.join(', ');
      const groupByClause = groupByCols ? `GROUP BY ${groupByCols}` : '';
      
      sql = `SELECT ${groupByCols ? `${groupByCols}, ` : ''}${aggCols} FROM (${inputSqls[0]}) t ${groupByClause}`;
      break;
      
    case 'union':
      if (inputSqls.length < 2) {
        throw new Error('Union operator requires at least two inputs');
      }
      sql = inputSqls.join(' UNION ALL ');
      break;
      
    case 'sort':
      if (inputSqls.length < 1) {
        throw new Error('Sort operator requires an input');
      }
      const sortCols = operator.sortColumns?.map(
        col => `${col.column} ${col.direction.toUpperCase()}`
      ).join(', ') || 'id ASC';
      
      sql = `SELECT * FROM (${inputSqls[0]}) t ORDER BY ${sortCols}`;
      break;
      
    case 'limit':
      if (inputSqls.length < 1) {
        throw new Error('Limit operator requires an input');
      }
      const limit = operator.limit || 100;
      const offset = operator.offset || 0;
      
      sql = `SELECT * FROM (${inputSqls[0]}) t LIMIT ${limit}${offset ? ` OFFSET ${offset}` : ''}`;
      break;
      
    default:
      throw new Error(`Unknown operator type: ${operator.type}`);
  }
  
  subqueries[operatorId] = sql;
  return sql;
}

// Main function to generate SQL from canvas state
export function generateSqlFromState(canvasState: CanvasState): string {
  try {
    if (canvasState.operators.length === 0) {
      return '';
    }
    
    const { tree, outputs } = buildOperatorTree(canvasState);
    
    if (outputs.length === 0) {
      return '';
    }
    
    // Generate SQL starting from the terminal operators
    const subqueries: Record<string, string> = {};
    const sqlStatements = outputs.map(opId => generateOperatorSql(opId, tree, subqueries));
    
    // For multiple terminal operators, wrap in CTEs
    if (sqlStatements.length > 1) {
      return `WITH ${
        outputs.map((opId, i) => 
          `output_${i + 1} AS (${subqueries[opId]})`
        ).join(',\n')
      }
      ${
        outputs.map((_, i) => `SELECT * FROM output_${i + 1}`).join('\nUNION ALL\n')
      }`;
    }
    
    return sqlStatements[0];
  } catch (error) {
    console.error('SQL generation error:', error);
    return `-- Error generating SQL: ${(error as Error).message}`;
  }
}
