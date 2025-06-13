
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FrequencySelectorProps {
  frequency: string;
  setFrequency: (value: string) => void;
}

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({ frequency, setFrequency }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="frequency">Frequency</Label>
      <Select 
        value={frequency} 
        onValueChange={setFrequency}
      >
        <SelectTrigger id="frequency" className="w-full">
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
