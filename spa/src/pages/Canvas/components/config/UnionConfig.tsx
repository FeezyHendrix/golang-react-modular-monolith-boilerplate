
import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UnionOperatorData, OperatorStatus } from '../../types';
import { BaseConfigProps } from './types';

interface UnionConfigProps extends BaseConfigProps<UnionOperatorData> {}

const UnionConfig: React.FC<UnionConfigProps> = ({ operator, onUpdateOperator, connectedOperators }) => {
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(operator.selectedColumns || []);
  const [isLoading, setIsLoading] = useState(true);
  const [sourcesConnected, setSourcesConnected] = useState(false);

  useEffect(() => {
    // Check if we have at least 2 connected operators
    const hasMultipleSources = connectedOperators && connectedOperators.length >= 2;
    setSourcesConnected(hasMultipleSources);
    
    if (hasMultipleSources) {
      // In a real implementation, we would merge columns from all sources
      setTimeout(() => {
        const allColumns = ['id', 'name', 'email', 'age', 'country', 'date', 'amount', 'category'];
        setAvailableColumns(allColumns);
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, [connectedOperators]);

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

  if (!sourcesConnected) {
    return (
      <Alert>
        <AlertDescription>
          Union operator requires at least 2 connected sources.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-4 p-0">
        {isLoading ? (
          <Progress value={50} className="w-full" />
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Select Columns to Union</Label>
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
                <p className="text-sm font-medium">Columns to union:</p>
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

export default UnionConfig;
