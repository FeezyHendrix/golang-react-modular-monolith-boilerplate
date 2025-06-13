
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Upload, Database, Mail, Bell, FileText, GitBranch, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AutomationBuilderProps {
  workflowId: string;
  onClose: () => void;
}

const AutomationBuilder: React.FC<AutomationBuilderProps> = ({ workflowId, onClose }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('overview');

  const categories = {
    triggers: [
      {
        id: 'schedule',
        title: 'Schedule Trigger',
        icon: <Calendar className="h-5 w-5" />,
        description: 'Runs a workflow at specific times using cron expressions',
        config: ['Cron Expression', 'Timezone']
      },
      {
        id: 'file-upload',
        title: 'File Upload Trigger',
        icon: <Upload className="h-5 w-5" />,
        description: 'Runs a workflow when specific files are uploaded',
        config: ['File Types', 'Destination Folder (optional)']
      },
      {
        id: 'data-update',
        title: 'Data Update Trigger',
        icon: <Database className="h-5 w-5" />,
        description: 'Runs a workflow when data changes in a specific source',
        config: ['Data Source', 'Resource ID (table/collection)']
      }
    ],
    actions: [
      {
        id: 'send-email',
        title: 'Send Email',
        icon: <Mail className="h-5 w-5" />,
        description: 'Sends email reports or alerts after a workflow completes',
        config: ['To Address(es)', 'Subject', 'Body', 'Attachments (optional)']
      },
      {
        id: 'send-notification',
        title: 'Send Notification',
        icon: <Bell className="h-5 w-5" />,
        description: 'Sends alerts to messaging platforms like Slack or Teams',
        config: ['Platform (Slack/Teams)', 'Webhook URL', 'Message']
      },
      {
        id: 'export-data',
        title: 'Export Data',
        icon: <FileText className="h-5 w-5" />,
        description: 'Exports workflow results to a file',
        config: ['Format (CSV, Excel, PDF)', 'Filename', 'Destination']
      }
    ],
    conditions: [
      {
        id: 'if-condition',
        title: 'If Condition',
        icon: <GitBranch className="h-5 w-5" />,
        description: 'Add logic to control your workflow execution path',
        config: ['Condition Expression', 'True Path', 'False Path']
      }
    ],
    utilities: [
      {
        id: 'delay',
        title: 'Delay',
        icon: <Clock className="h-5 w-5" />,
        description: 'Pauses workflow execution for a specified period of time',
        config: ['Duration', 'Time Unit (seconds/minutes/hours)']
      },
      {
        id: 'scheduled-wait',
        title: 'Scheduled Wait',
        icon: <Clock className="h-5 w-5" />,
        description: 'Pauses until a specific date/time is reached',
        config: ['Date and Time', 'Timezone']
      }
    ]
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Create Automation</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            toast({
              title: "Automation Created",
              description: "Your automation workflow has been saved successfully."
            });
            onClose();
          }}>Create Automation</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="utilities">Utilities</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        {Object.entries(categories).map(([category, items]) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Card key={item.id} className="p-6 hover:border-primary cursor-pointer transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Configuration</h4>
                        <ul className="text-sm text-muted-foreground list-disc pl-4">
                          {item.config.map((conf, idx) => (
                            <li key={idx}>{conf}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="overview" className="mt-6">
          <div className="prose max-w-none">
            <h3>Getting Started with Workflow Automation</h3>
            <p className="text-muted-foreground">
              Build your automation workflow by combining triggers, actions, conditions, and utilities.
              Start by selecting a trigger, then add actions and optionally include conditions and utilities to create powerful automated workflows.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="examples" className="mt-6">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-2">Daily Sales Report Automation</h3>
              <p className="text-sm text-muted-foreground mb-4">Automatically generate and email daily sales reports</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Workflow Components</h4>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                    <li>Trigger: Schedule (Cron: 0 0 * * *) - Every day at midnight</li>
                    <li>Action 1: Export Data (Excel format)</li>
                    <li>Action 2: Email to team</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationBuilder;
