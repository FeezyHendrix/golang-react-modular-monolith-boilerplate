
import React, { useState } from 'react';
import { SortOperatorData, SortField, SortDirection } from '../../types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X, Plus, ArrowUpDown } from 'lucide-react';

interface SortConfigProps {
  operator: SortOperatorData;
  onUpdateOperator: (operator: SortOperatorData) => void;
  getAvailableColumns?: (operatorId: string) => string[];
}

const SortConfig: React.FC<SortConfigProps> = ({ 
  operator, 
  onUpdateOperator,
  getAvailableColumns = () => [] 
}) => {
  const availableColumns = getAvailableColumns(operator.id) || ['id', 'name', 'email', 'age', 'city', 'country'];
  const [sortFields, setSortFields] = useState<SortField[]>(operator.sortFields || []);

  const handleSortFieldChange = (index: number, field: string, value: string) => {
    const newSortFields = [...sortFields];
    
    if (field === 'field') {
      newSortFields[index] = { 
        ...newSortFields[index], 
        field: value 
      };
    } else if (field === 'direction') {
      newSortFields[index] = { 
        ...newSortFields[index], 
        direction: value as SortDirection
      };
    }
    
    setSortFields(newSortFields);
    onUpdateOperator({ ...operator, sortFields: newSortFields });
  };

  const handleAddSortField = () => {
    const newSortField = { 
      field: availableColumns[0] || '', 
      direction: SortDirection.ASC 
    };
    const newSortFields = [...sortFields, newSortField];
    setSortFields(newSortFields);
    onUpdateOperator({ ...operator, sortFields: newSortFields });
  };

  const handleRemoveSortField = (index: number) => {
    const newSortFields = sortFields.filter((_, i) => i !== index);
    setSortFields(newSortFields);
    onUpdateOperator({ ...operator, sortFields: newSortFields });
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Sort Fields</h3>
        <p className="text-sm text-muted-foreground">
          Define fields to sort your data by. Fields are sorted in the order they appear.
        </p>
      </div>

      {sortFields.map((sortField, index) => (
        <div key={index} className="grid grid-cols-[1fr_auto] gap-2">
          <div className="space-y-2">
            <div>
              <Label htmlFor={`field-${index}`}>Field</Label>
              <Select
                value={sortField.field}
                onValueChange={(value) => handleSortFieldChange(index, 'field', value)}
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
              <Label htmlFor={`direction-${index}`}>Direction</Label>
              <Select
                value={sortField.direction}
                onValueChange={(value) => handleSortFieldChange(index, 'direction', value)}
              >
                <SelectTrigger id={`direction-${index}`}>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SortDirection.ASC}>Ascending</SelectItem>
                  <SelectItem value={SortDirection.DESC}>Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="self-end"
            onClick={() => handleRemoveSortField(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleAddSortField}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Sort Field
      </Button>
    </div>
  );
};

export default SortConfig;
