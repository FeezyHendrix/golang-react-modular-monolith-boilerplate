
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MonthlyDatesSelectorProps {
  monthlyDates: number[];
  toggleMonthDate: (date: number) => void;
}

export const MonthlyDatesSelector: React.FC<MonthlyDatesSelectorProps> = ({ monthlyDates, toggleMonthDate }) => {
  return (
    <div className="space-y-2">
      <Label>Dates of Month</Label>
      <div className="flex flex-wrap gap-2">
        {Array.from({length: 31}, (_, i) => i + 1).map((date) => (
          <div key={date} className="flex items-center">
            <Checkbox 
              id={`date-${date}`} 
              checked={monthlyDates.includes(date)} 
              onCheckedChange={() => toggleMonthDate(date)} 
              className="sr-only"
            />
            <Label 
              htmlFor={`date-${date}`} 
              className={`cursor-pointer rounded-md px-2 py-1 text-sm ${
                monthlyDates.includes(date) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary'
              }`}
            >
              {date}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
