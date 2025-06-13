
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TriggerType } from '../../../types/automation';

interface TriggerTypeSelectorProps {
  triggerType: string;
  setTriggerType: (value: string) => void;
}

export const TriggerTypeSelector: React.FC<TriggerTypeSelectorProps> = ({ triggerType, setTriggerType }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="trigger-type">Trigger Type</Label>
      <Select 
        value={triggerType} 
        onValueChange={setTriggerType}
      >
        <SelectTrigger id="trigger-type" className="w-full">
          <SelectValue placeholder="Select trigger type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="schedule">Schedule</SelectItem>
          <SelectItem value="file-upload">File Upload</SelectItem>
          <SelectItem value="data-update">Data Update</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
