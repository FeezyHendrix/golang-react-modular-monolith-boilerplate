
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SavedWorkflow } from '../types';
import { format } from 'date-fns';
import { Play, Edit, Trash2, Search, Zap, CircleCheck, CircleDot } from 'lucide-react';
import RunWorkflowDialog from './RunWorkflowDialog';

interface SavedWorkflowsProps {
  onLoadWorkflow: (workflowId: string) => void;
  onRunWorkflow: (workflowId: string, options: any) => Promise<void>;
  onDeleteWorkflow: (workflowId: string) => void;
  onAutomationClick: (workflowId: string) => void;
}

const SavedWorkflows: React.FC<SavedWorkflowsProps> = ({
  onLoadWorkflow,
  onRunWorkflow,
  onDeleteWorkflow,
  onAutomationClick
}) => {
  const [workflows, setWorkflows] = useState<SavedWorkflow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    loadSavedWorkflows();
  }, []);

  const loadSavedWorkflows = () => {
    try {
      const savedString = localStorage.getItem('savedCanvases');
      const saved = savedString ? JSON.parse(savedString) : [];
      setWorkflows(saved);
    } catch (error) {
      console.error('Error loading saved workflows:', error);
      setWorkflows([]);
    }
  };

  const handleRunClick = (workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    setIsRunDialogOpen(true);
  };

  const handleRunWorkflow = async (options: any) => {
    if (!selectedWorkflowId) return;
    
    setIsRunning(true);
    try {
      await onRunWorkflow(selectedWorkflowId, options);
      setIsRunDialogOpen(false);
    } catch (error) {
      console.error('Error running workflow:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    onDeleteWorkflow(workflowId);
    loadSavedWorkflows(); // Refresh the list after deletion
  };

  const getStatusColor = (status: string = 'success') => {
    switch(status) {
      case 'running':
        return 'text-orange-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-green-500';
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const searchLower = searchTerm.toLowerCase();
    return (
      workflow.name?.toLowerCase().includes(searchLower) ||
      workflow.description?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search workflows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      {filteredWorkflows.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold truncate">
                    {workflow.name}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => onAutomationClick(workflow.id)}
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Automate
                  </Button>
                </div>
                <CardDescription className="line-clamp-2 h-10">
                  {workflow.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CircleDot className={`h-3 w-3 mr-2 ${getStatusColor('success')}`} />
                    <span>Created: {formatDate(workflow.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <CircleDot className={`h-3 w-3 mr-2 ${getStatusColor('running')}`} />
                    <span>Updated: {formatDate(workflow.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-2 border-t">
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost"
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => onDeleteWorkflow(workflow.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => onLoadWorkflow(workflow.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm"
                        className="h-8"
                        onClick={() => onRunWorkflow(workflow.id, {})}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Run
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md">
          <h3 className="text-lg font-medium mb-2">No workflows found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? "No workflows match your search criteria" 
              : "You haven't saved any workflows yet"}
          </p>
          {searchTerm && (
            <Button 
              variant="outline"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}

      <RunWorkflowDialog
        open={isRunDialogOpen}
        onClose={() => setIsRunDialogOpen(false)}
        onRun={handleRunWorkflow}
        isLoading={isRunning}
      />
    </div>
  );
};

export default SavedWorkflows;
