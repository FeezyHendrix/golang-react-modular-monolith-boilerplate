
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FrequencySelector } from './FrequencySelector';
import { TimeSelector } from './TimeSelector';
import { WeeklyDaysSelector } from './WeeklyDaysSelector';
import { MonthlyDatesSelector } from './MonthlyDatesSelector';
import { TimezoneSelector } from './TimezoneSelector';

interface ScheduleConfigProps {
  frequency: string;
  setFrequency: (value: string) => void;
  timeOfDay: string;
  setTimeOfDay: (value: string) => void;
  timezone: string;
  setTimezone: (value: string) => void;
  weeklyDays: string[];
  setWeeklyDays: React.Dispatch<React.SetStateAction<string[]>>;
  monthlyDates: number[];
  setMonthlyDates: React.Dispatch<React.SetStateAction<number[]>>;
  handleApply: () => void;
}

export const ScheduleConfig: React.FC<ScheduleConfigProps> = ({
  frequency,
  setFrequency,
  timeOfDay,
  setTimeOfDay,
  timezone,
  setTimezone,
  weeklyDays,
  setWeeklyDays,
  monthlyDates,
  setMonthlyDates,
  handleApply
}) => {
  const [selectedTab, setSelectedTab] = useState('simple');

  const toggleWeekDay = (day: string) => {
    if (weeklyDays.includes(day)) {
      setWeeklyDays(weeklyDays.filter(d => d !== day));
    } else {
      setWeeklyDays([...weeklyDays, day]);
    }
  };
  
  const toggleMonthDate = (date: number) => {
    if (monthlyDates.includes(date)) {
      setMonthlyDates(monthlyDates.filter(d => d !== date));
    } else {
      setMonthlyDates([...monthlyDates, date]);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">Simple</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple" className="space-y-4">
          <FrequencySelector frequency={frequency} setFrequency={setFrequency} />
          <TimeSelector timeOfDay={timeOfDay} setTimeOfDay={setTimeOfDay} />
          
          {frequency === 'weekly' && (
            <WeeklyDaysSelector weeklyDays={weeklyDays} toggleWeekDay={toggleWeekDay} />
          )}
          
          {frequency === 'monthly' && (
            <MonthlyDatesSelector monthlyDates={monthlyDates} toggleMonthDate={toggleMonthDate} />
          )}
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <TimezoneSelector timezone={timezone} setTimezone={setTimezone} />
        </TabsContent>
      </Tabs>
      
      <Button onClick={handleApply} className="w-full">
        Apply Schedule Configuration
      </Button>
    </div>
  );
};
