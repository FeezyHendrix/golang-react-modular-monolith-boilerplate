
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AutomationConfig } from '../../types/automation';
import AutomationCard from './AutomationCard';

interface AutomationListProps {
  automations: AutomationConfig[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (automation: AutomationConfig) => void;
  onToggleStatus: (automationId: string) => void;
  onDelete: (automationId: string) => void;
  onRun: (automation: AutomationConfig) => void;
  getWorkflowName: (workflowId?: string) => string;
  formatDate: (dateString?: string) => string;
}

const AutomationList: React.FC<AutomationListProps> = ({
  automations,
  searchTerm,
  onSearchChange,
  onEdit,
  onToggleStatus,
  onDelete,
  onRun,
  getWorkflowName,
  formatDate
}) => {
  const filteredAutomations = automations.filter(automation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      automation.name?.toLowerCase().includes(searchLower) ||
      automation.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search automations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      {filteredAutomations.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredAutomations.map((automation) => (
            <AutomationCard
              key={automation.id}
              automation={automation}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onRun={onRun}
              getWorkflowName={getWorkflowName}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md">
          <h3 className="text-lg font-medium mb-2">No automations found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? "No automations match your search criteria" 
              : "You haven't created any automations yet"}
          </p>
          {searchTerm && (
            <Button 
              variant="outline"
              onClick={() => onSearchChange('')}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AutomationList;
