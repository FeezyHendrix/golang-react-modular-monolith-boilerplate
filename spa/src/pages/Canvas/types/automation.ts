
export type TriggerType = 'schedule' | 'file-upload' | 'data-update';

export interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  timeOfDay: string;
  timezone: string;
  weeklyDays?: string[];
  monthlyDates?: number[];
}

export interface EmailConfig {
  to: string;
  subject: string;
  body: string;
  attachments?: File[];
}

export interface ExportConfig {
  format: 'CSV' | 'Excel' | 'PDF';
  filename: string;
  destinationFolder: string;
}

export interface AutomationConfig {
  id?: string;
  name: string;
  description?: string;
  workflowId?: string;
  active: boolean;
  triggerType: TriggerType;
  triggerConfig?: any;
  email?: EmailConfig;
  export?: ExportConfig;
  lastRun?: string;
  trigger?: {
    type: TriggerType;
    config: ScheduleConfig | any;
  };
}
