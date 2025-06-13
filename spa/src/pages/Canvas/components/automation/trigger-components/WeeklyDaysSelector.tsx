
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface WeeklyDaysSelectorProps {
  weeklyDays: string[];
  toggleWeekDay: (day: string) => void;
}

export const WeeklyDaysSelector: React.FC<WeeklyDaysSelectorProps> = ({ weeklyDays, toggleWeekDay }) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="space-y-2">
      <Label>Days of Week</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center space-x-2">
            <Checkbox 
              id={`day-${day}`} 
              checked={weeklyDays.includes(day)} 
              onCheckedChange={() => toggleWeekDay(day)} 
            />
            <Label htmlFor={`day-${day}`}>{day}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};
