
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { AggregateOperatorData, AggregateFunction, OperatorStatus } from '../../types';
import { BaseConfigProps } from './types';

interface AggregateConfigProps extends BaseConfigProps<AggregateOperatorData> {}

const AggregateConfig: React.FC<AggregateConfigProps> = ({ operator, onUpdateOperator }) => {
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [selectedGroupByColumn, setSelectedGroupByColumn] = useState<string>('');
  const [selectedAggregations, setSelectedAggregations] = useState<Array<{
    field: string;
    function: AggregateFunction;
  }>>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulating loading columns from the connected operator
    const sampleColumns = ['id', 'name', 'amount', 'date', 'category'];
    setAvailableColumns(sampleColumns);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGroupByChange = (column: string) => {
    setSelectedGroupByColumn(column);
    onUpdateOperator({
      ...operator,
      groupByFields: [column],
      status: column ? OperatorStatus.CONFIGURED : OperatorStatus.NEW
    });
  };

  const handleAggregationChange = (field: string, checked: boolean) => {
    let newAggregations;
    if (checked) {
      newAggregations = [...selectedAggregations, { field, function: AggregateFunction.COUNT }];
    } else {
      newAggregations = selectedAggregations.filter(agg => agg.field !== field);
    }
    setSelectedAggregations(newAggregations);
    
    onUpdateOperator({
      ...operator,
      aggregations: newAggregations,
      status: newAggregations.length > 0 ? OperatorStatus.CONFIGURED : OperatorStatus.NEW
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-4 p-0">
        {progress < 100 ? (
          <Progress value={progress} className="w-full" />
        ) : (
          <>
            <div className="space-y-2">
              <Label>Group By Column</Label>
              <Select
                value={selectedGroupByColumn}
                onValueChange={handleGroupByChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {availableColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label>Aggregate Columns</Label>
              <div className="space-y-2">
                {availableColumns.map((column) => (
                  <div key={column} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${column}`}
                      checked={selectedAggregations.some(agg => agg.field === column)}
                      onCheckedChange={(checked) => 
                        handleAggregationChange(column, checked as boolean)
                      }
                    />
                    <Label htmlFor={`column-${column}`}>{column}</Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AggregateConfig;
