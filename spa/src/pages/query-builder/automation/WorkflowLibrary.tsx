
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SavedWorkflow } from './types';
import { format } from 'date-fns';
import { Search, Play, Edit, Trash, Clock } from 'lucide-react';

interface WorkflowLibraryProps {
  onLoadWorkflow: (workflowId: string) => boolean;
}

const WorkflowLibrary: React.FC<WorkflowLibraryProps> = ({ onLoadWorkflow }) => {
  const [workflows, setWorkflows] = useState<SavedWorkflow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load saved workflows from localStorage
  useEffect(() => {
    const loadWorkflows = () => {
      try {
        const savedString = localStorage.getItem('savedWorkflows');
        const saved = savedString ? JSON.parse(savedString) : [];
        setWorkflows(saved);
      } catch (error) {
        console.error('Error loading saved workflows:', error);
        setWorkflows([]);
      }
    };
    
    loadWorkflows();
  }, []);
  
  // Filter workflows based on search term
  const filteredWorkflows = workflows.filter(workflow => {
    const searchLower = searchTerm.toLowerCase();
    return (
      workflow.name?.toLowerCase().includes(searchLower) ||
      workflow.description?.toLowerCase().includes(searchLower) ||
      workflow.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });
  
  // Handle loading a workflow
  const handleLoadWorkflow = (workflowId: string) => {
    onLoadWorkflow(workflowId);
  };
  
  // Handle deleting a workflow
  const handleDeleteWorkflow = (workflowId: string) => {
    try {
      // Remove from list
      const updatedWorkflows = workflows.filter(w => w.id !== workflowId);
      setWorkflows(updatedWorkflows);
      
      // Update localStorage
      localStorage.setItem('savedWorkflows', JSON.stringify(updatedWorkflows));
      
      // Remove workflow details
      localStorage.removeItem(`workflow-${workflowId}`);
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      {filteredWorkflows.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{workflow.name}</CardTitle>
                  <div className="text-xs flex items-center text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(workflow.updatedAt)}
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {workflow.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1 mb-3">
                  {workflow.tags && workflow.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {(!workflow.tags || workflow.tags.length === 0) && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      No tags
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <div>
                    {workflow.lastRun ? (
                      <span>Last run: {formatDate(workflow.lastRun)}</span>
                    ) : (
                      <span>Never run</span>
                    )}
                  </div>
                  <div>
                    Runs: {workflow.runCount || 0}
                  </div>
                </div>
                
                <div className="flex justify-end mt-3 space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8"
                    onClick={() => handleLoadWorkflow(workflow.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm"
                    className="h-8"
                    onClick={() => handleLoadWorkflow(workflow.id)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </Button>
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
              : "You haven't created any workflows yet"}
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
    </div>
  );
};

export default WorkflowLibrary;
