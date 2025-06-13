
import React from 'react';
import { format } from 'date-fns';
import { 
  Play, 
  Edit,
  Trash2,
  Calendar,
  Upload,
  Database,
  PauseCircle,
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AutomationConfig, TriggerType } from '../../types/automation';
import { SavedWorkflow } from '../../types';

interface AutomationCardProps {
  automation: AutomationConfig;
  onEdit: (automation: AutomationConfig) => void;
  onToggleStatus: (automationId: string) => void;
  onDelete: (automationId: string) => void;
  onRun: (automation: AutomationConfig) => void;
  getWorkflowName: (workflowId?: string) => string;
  formatDate: (dateString?: string) => string;
}

const AutomationCard: React.FC<AutomationCardProps> = ({
  automation,
  onEdit,
  onToggleStatus,
  onDelete,
  onRun,
  getWorkflowName,
  formatDate
}) => {
  const getTriggerIcon = (triggerType: TriggerType) => {
    switch(triggerType) {
      case 'schedule':
        return <Calendar className="h-4 w-4" />;
      case 'file-upload':
        return <Upload className="h-4 w-4" />;
      case 'data-update':
        return <Database className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card className={automation.active ? "" : "opacity-70"}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{automation.name}</CardTitle>
            <Badge variant={automation.active ? "default" : "outline"}>
              {automation.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <CardDescription className="flex gap-2 items-center">
          {getTriggerIcon(automation.triggerType)}
          {automation.triggerType === 'schedule' 
            ? `Runs on schedule (${automation.trigger?.type === 'schedule' ? 
                (automation.trigger as any).frequency || 'custom' : 'custom'})` 
            : automation.triggerType === 'file-upload'
              ? 'Runs on file upload'
              : 'Runs on data update'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm">
            <p className="text-muted-foreground mb-1 truncate">
              Workflow: {getWorkflowName(automation.workflowId)}
            </p>
            <p className="text-muted-foreground">
              Last run: {formatDate(automation.lastRun)}
            </p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => onDelete(automation.id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onToggleStatus(automation.id!)}
              >
                {automation.active ? 
                  <PauseCircle className="h-4 w-4" /> : 
                  <Play className="h-4 w-4" />
                }
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => onEdit(automation)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
            
            <Button
              size="sm"
              className="h-8"
              onClick={() => onRun(automation)}
            >
              <Play className="h-4 w-4 mr-1" />
              Run Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationCard;
