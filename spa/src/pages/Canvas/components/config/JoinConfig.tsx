
import React, { useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JoinOperatorData, JoinType, OperatorStatus } from '../../types';
import { BaseConfigProps } from './types';

const JoinConfig: React.FC<BaseConfigProps<JoinOperatorData>> = ({ operator, onUpdateOperator }) => {
  const handleJoinTypeChange = (value: string) => {
    onUpdateOperator({
      ...operator,
      joinType: value as JoinType
    });
  };

  const handleKeyChange = (field: 'leftKey' | 'rightKey', value: string) => {
    const updatedOperator = {
      ...operator,
      [field]: value
    };
    
    // Check if both keys are defined, update status if they are
    const allKeysConfigured = updatedOperator.leftKey && updatedOperator.rightKey;
    if (allKeysConfigured) {
      updatedOperator.status = OperatorStatus.CONFIGURED;
    }
    
    onUpdateOperator(updatedOperator);
  };
  
  // Effect to set status to CONFIGURED if both keys are already set
  useEffect(() => {
    if (operator.leftKey && operator.rightKey && operator.status !== OperatorStatus.CONFIGURED) {
      onUpdateOperator({
        ...operator,
        status: OperatorStatus.CONFIGURED
      });
    }
  }, [operator, onUpdateOperator]);

  return (
    <div className="space-y-4">
      <div>
        <Label>Join Type</Label>
        <Select
          value={operator.joinType || 'INNER'}
          onValueChange={handleJoinTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select join type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INNER">Inner Join</SelectItem>
            <SelectItem value="LEFT">Left Join</SelectItem>
            <SelectItem value="RIGHT">Right Join</SelectItem>
            <SelectItem value="FULL">Full Join</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Left Key</Label>
        <Select
          value={operator.leftKey}
          onValueChange={(value) => handleKeyChange('leftKey', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select left key" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="customer_id">Customer ID</SelectItem>
            <SelectItem value="order_id">Order ID</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Right Key</Label>
        <Select
          value={operator.rightKey}
          onValueChange={(value) => handleKeyChange('rightKey', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select right key" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="customer_id">Customer ID</SelectItem>
            <SelectItem value="order_id">Order ID</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default JoinConfig;
