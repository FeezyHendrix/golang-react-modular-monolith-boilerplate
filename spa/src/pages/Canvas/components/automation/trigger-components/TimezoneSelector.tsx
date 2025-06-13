
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TimezoneSelectorProps {
  timezone: string;
  setTimezone: (value: string) => void;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({ timezone, setTimezone }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="timezone">Timezone</Label>
      <Select 
        value={timezone} 
        onValueChange={setTimezone}
      >
        <SelectTrigger id="timezone" className="w-full">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="UTC">UTC</SelectItem>
          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
