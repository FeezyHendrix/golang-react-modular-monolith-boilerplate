
import React, { useState } from 'react';
import { FilterCondition, FilterOperatorData } from '../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface FilterConfigProps {
  operator: FilterOperatorData;
  onUpdateOperator: (operator: FilterOperatorData) => void;
  getAvailableColumns?: (operatorId: string) => string[];
}

const FilterConfig: React.FC<FilterConfigProps> = ({ 
  operator, 
  onUpdateOperator,
  getAvailableColumns = () => [] 
}) => {
  const availableColumns = getAvailableColumns(operator.id) || ['id', 'name', 'email', 'age', 'city', 'country'];
  const [conditions, setConditions] = useState<FilterCondition[]>(operator.conditions || []);

  const handleConditionChange = (index: number, field: keyof FilterCondition, value: string | number | boolean) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
    onUpdateOperator({ ...operator, conditions: newConditions });
  };

  const handleAddCondition = () => {
    const newCondition = { field: availableColumns[0] || '', operator: '=', value: '' };
    const newConditions = [...conditions, newCondition];
    setConditions(newConditions);
    onUpdateOperator({ ...operator, conditions: newConditions });
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
    onUpdateOperator({ ...operator, conditions: newConditions });
  };

  const renderOperators = (fieldName: string) => {
    // Simple logic to determine appropriate operators based on field name
    const isNumeric = fieldName.toLowerCase().includes('id') || 
                      fieldName.toLowerCase().includes('age') || 
                      fieldName.toLowerCase().includes('count');
                      
    const operators = isNumeric 
      ? ['=', '!=', '>', '<', '>=', '<=']
      : ['=', '!=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN'];
      
    return operators.map(op => (
      <SelectItem key={op} value={op}>{op}</SelectItem>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Filter Conditions</h3>
        <p className="text-sm text-muted-foreground">
          Define conditions to filter your data. Only rows that match all conditions will be included.
        </p>
      </div>

      {conditions.map((condition, index) => (
        <div key={index} className="grid grid-cols-[1fr_auto] gap-2">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`field-${index}`}>Field</Label>
                <Select
                  value={condition.field}
                  onValueChange={(value) => handleConditionChange(index, 'field', value)}
                >
                  <SelectTrigger id={`field-${index}`}>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColumns.map(column => (
                      <SelectItem key={column} value={column}>{column}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`operator-${index}`}>Operator</Label>
                <Select
                  value={condition.operator}
                  onValueChange={(value) => handleConditionChange(index, 'operator', value)}
                >
                  <SelectTrigger id={`operator-${index}`}>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {renderOperators(condition.field)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor={`value-${index}`}>Value</Label>
              <Input
                id={`value-${index}`}
                value={String(condition.value)}
                onChange={(e) => {
                  // Convert to appropriate type based on field name
                  const fieldName = condition.field.toLowerCase();
                  let value: string | number | boolean = e.target.value;
                  
                  if (fieldName.includes('id') || fieldName.includes('age') || fieldName.includes('count')) {
                    const num = parseFloat(e.target.value);
                    if (!isNaN(num)) {
                      value = num;
                    }
                  } else if (e.target.value.toLowerCase() === 'true') {
                    value = true;
                  } else if (e.target.value.toLowerCase() === 'false') {
                    value = false;
                  }
                  
                  handleConditionChange(index, 'value', value);
                }}
                placeholder="Enter value"
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="self-end"
            onClick={() => handleRemoveCondition(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleAddCondition}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Condition
      </Button>
    </div>
  );
};

export default FilterConfig;
