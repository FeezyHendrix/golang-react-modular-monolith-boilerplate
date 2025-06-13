
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeSelectorProps {
  timeOfDay: string;
  setTimeOfDay: (value: string) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ timeOfDay, setTimeOfDay }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="time">Time of Day</Label>
      <Input
        id="time"
        type="time"
        value={timeOfDay}
        onChange={(e) => setTimeOfDay(e.target.value)}
      />
    </div>
  );
};
