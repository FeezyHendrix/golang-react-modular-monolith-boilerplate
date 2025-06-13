
import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SelectOperatorData, OperatorStatus } from '../../types';
import { BaseConfigProps } from './types';

interface SelectConfigProps extends BaseConfigProps<SelectOperatorData> {}

const SelectConfig: React.FC<SelectConfigProps> = ({ operator, onUpdateOperator, connectedOperators, getAvailableColumns }) => {
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(operator.selectedColumns || []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, load columns from connected operator
    setTimeout(() => {
      const sampleColumns = ['id', 'name', 'email', 'age', 'country', 'date', 'amount'];
      setAvailableColumns(sampleColumns);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleColumnChange = (column: string, checked: boolean) => {
    let updatedColumns;
    if (checked) {
      updatedColumns = [...selectedColumns, column];
    } else {
      updatedColumns = selectedColumns.filter(col => col !== column);
    }
    
    setSelectedColumns(updatedColumns);
    
    onUpdateOperator({
      ...operator,
      selectedColumns: updatedColumns,
      status: updatedColumns.length > 0 ? OperatorStatus.CONFIGURED : OperatorStatus.UNCONFIGURED
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-4 p-0">
        {isLoading ? (
          <Progress value={50} className="w-full" />
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Select Columns</Label>
              <div className="bg-secondary/20 p-3 rounded-md max-h-72 overflow-y-auto space-y-2">
                {availableColumns.map((column) => (
                  <div key={column} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${column}`}
                      checked={selectedColumns.includes(column)}
                      onCheckedChange={(checked) => 
                        handleColumnChange(column, checked as boolean)
                      }
                    />
                    <Label htmlFor={`column-${column}`}>{column}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedColumns.length > 0 && (
              <div className="border-l-2 border-primary pl-3">
                <p className="text-sm font-medium">Selected columns:</p>
                <p className="text-sm text-muted-foreground">
                  {selectedColumns.join(', ')}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectConfig;
