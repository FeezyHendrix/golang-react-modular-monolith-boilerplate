
// SQL validation
export const validateSql = (query: string): string | null => {
  const trimmedQuery = query.trim().toLowerCase();
  
  if (!trimmedQuery) return "SQL query cannot be empty.";
  
  // Basic syntax checks
  if (!trimmedQuery.includes('select')) {
    return "Query must include a SELECT statement.";
  }
  
  if (!trimmedQuery.includes('from')) {
    return "Query must include a FROM clause.";
  }
  
  // Check for unbalanced parentheses
  const openParens = (trimmedQuery.match(/\(/g) || []).length;
  const closeParens = (trimmedQuery.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    return "Unbalanced parentheses in query.";
  }
  
  // Check for missing semicolon at the end
  if (!trimmedQuery.endsWith(';')) {
    return "SQL query should end with a semicolon (;)";
  }
  
  return null;
};

// Python validation
export const validatePython = (code: string): string | null => {
  const trimmedCode = code.trim();
  
  if (!trimmedCode) return "Python code cannot be empty.";
  
  // Check for indentation errors
  const lines = trimmedCode.split('\n');
  let inBlock = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().endsWith(':')) {
      inBlock = true;
    } else if (inBlock && !lines[i].startsWith(' ') && !lines[i].startsWith('\t') && lines[i].trim().length > 0) {
      return `Indentation error at line ${i + 1}: expected indented block`;
    }
  }
  
  // Check for unbalanced parentheses
  const openParens = (trimmedCode.match(/\(/g) || []).length;
  const closeParens = (trimmedCode.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    return "Unbalanced parentheses in code.";
  }
  
  // Check for unbalanced brackets
  const openBrackets = (trimmedCode.match(/\[/g) || []).length;
  const closeBrackets = (trimmedCode.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    return "Unbalanced brackets in code.";
  }
  
  // Check for pandas dataframe operation that would return data
  if (!trimmedCode.includes('pd.') && !trimmedCode.includes('pandas')) {
    return "Python code should use pandas (pd) for data manipulation.";
  }
  
  return null;
};
