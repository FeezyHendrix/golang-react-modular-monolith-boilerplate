
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TriggerTypeSelector } from './trigger-components/TriggerTypeSelector';
import { ScheduleConfig } from './trigger-components/ScheduleConfig';

interface ScheduleTriggerProps {
  onConfigChange: (config: any) => void;
  initialConfig?: any;
}

export const ScheduleTrigger: React.FC<ScheduleTriggerProps> = ({ 
  onConfigChange,
  initialConfig 
}) => {
  const [triggerType, setTriggerType] = useState('schedule');
  const [frequency, setFrequency] = useState('daily');
  const [timeOfDay, setTimeOfDay] = useState('09:00');
  const [timezone, setTimezone] = useState('UTC');
  const [weeklyDays, setWeeklyDays] = useState<string[]>(['Monday']);
  const [monthlyDates, setMonthlyDates] = useState<number[]>([1]);

  // Pre-fill with initial config if provided
  useEffect(() => {
    if (initialConfig) {
      setTriggerType(initialConfig.type || 'schedule');
      
      if (initialConfig.frequency) {
        setFrequency(initialConfig.frequency);
        setTimeOfDay(initialConfig.timeOfDay || '09:00');
        setTimezone(initialConfig.timezone || 'UTC');
        
        if (initialConfig.frequency === 'weekly' && initialConfig.weeklyDays) {
          setWeeklyDays(initialConfig.weeklyDays);
        }
        
        if (initialConfig.frequency === 'monthly' && initialConfig.monthlyDates) {
          setMonthlyDates(initialConfig.monthlyDates);
        }
      }
    }
  }, [initialConfig]);

  const handleApply = () => {
    // Build the configuration object
    const config = {
      type: triggerType,
      frequency,
      timeOfDay,
      timezone,
    };
    
    // Add frequency-specific properties
    if (frequency === 'weekly') {
      Object.assign(config, { weeklyDays });
    } else if (frequency === 'monthly') {
      Object.assign(config, { monthlyDates });
    }
    
    // Callback with the completed configuration
    onConfigChange(config);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Schedule Configuration</CardTitle>
        <CardDescription>
          Define when this automation will run
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TriggerTypeSelector triggerType={triggerType} setTriggerType={setTriggerType} />
        
        {triggerType === 'schedule' && (
          <ScheduleConfig 
            frequency={frequency}
            setFrequency={setFrequency}
            timeOfDay={timeOfDay}
            setTimeOfDay={setTimeOfDay}
            timezone={timezone}
            setTimezone={setTimezone}
            weeklyDays={weeklyDays}
            setWeeklyDays={setWeeklyDays}
            monthlyDates={monthlyDates}
            setMonthlyDates={setMonthlyDates}
            handleApply={handleApply}
          />
        )}
        
        {triggerType === 'file-upload' && (
          <div className="flex justify-center py-8">
            <Button 
              onClick={() => onConfigChange({ type: 'file-upload' })}
              className="w-full"
            >
              Apply File Upload Trigger
            </Button>
          </div>
        )}
        
        {triggerType === 'data-update' && (
          <div className="flex justify-center py-8">
            <Button 
              onClick={() => onConfigChange({ type: 'data-update' })}
              className="w-full"
            >
              Apply Data Update Trigger
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
