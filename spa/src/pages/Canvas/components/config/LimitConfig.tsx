
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LimitOperatorData, OperatorStatus } from '../../types';
import { BaseConfigProps } from './types';

interface LimitConfigProps extends BaseConfigProps<LimitOperatorData> {}

const LimitConfig: React.FC<LimitConfigProps> = ({ operator, onUpdateOperator }) => {
  const [limit, setLimit] = useState<number>(operator.limit || 100);
  const [direction, setDirection] = useState<'top' | 'bottom'>(operator.direction || 'top');

  const handleLimitChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setLimit(parsedValue);
      updateOperator(parsedValue, direction);
    } else if (value === '') {
      setLimit(undefined as any);
      updateOperator(undefined as any, direction);
    }
  };

  const handleDirectionChange = (value: 'top' | 'bottom') => {
    setDirection(value);
    updateOperator(limit, value);
  };

  const updateOperator = (limitValue: number, directionValue: 'top' | 'bottom') => {
    onUpdateOperator({
      ...operator,
      limit: limitValue,
      direction: directionValue,
      status: limitValue ? OperatorStatus.CONFIGURED : OperatorStatus.UNCONFIGURED
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-4 p-0">
        <div className="space-y-2">
          <Label htmlFor="limit">Row Limit</Label>
          <Input
            id="limit"
            type="number"
            min="1"
            value={limit || ''}
            onChange={(e) => handleLimitChange(e.target.value)}
            placeholder="Enter row count"
          />
        </div>

        <div className="space-y-2">
          <Label>Direction</Label>
          <RadioGroup
            value={direction}
            onValueChange={(value) => handleDirectionChange(value as 'top' | 'bottom')}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="top" id="top" />
              <Label htmlFor="top">Top rows</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bottom" id="bottom" />
              <Label htmlFor="bottom">Bottom rows</Label>
            </div>
          </RadioGroup>
        </div>

        {limit && (
          <div className="border-l-2 border-primary pl-3">
            <p className="text-sm font-medium">Limit:</p>
            <p className="text-sm text-muted-foreground">
              {direction === 'top' ? 'Top' : 'Bottom'} {limit} rows
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LimitConfig;
