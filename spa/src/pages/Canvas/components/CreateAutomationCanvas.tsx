
import React, { useState, useEffect } from 'react';
import CreateAutomationFlow from './automation/CreateAutomationFlow';
import { useToast } from '@/hooks/use-toast';
import { AutomationDialog } from './automation/AutomationDialog';

interface CreateAutomationCanvasProps {
  workflowId: string;
  onClose: () => void;
}

const CreateAutomationCanvas: React.FC<CreateAutomationCanvasProps> = ({ workflowId, onClose }) => {
  const { toast } = useToast();
  const [workflowName, setWorkflowName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  useEffect(() => {
    // Get workflow name from localStorage
    try {
      const savedString = localStorage.getItem('savedCanvases');
      const saved = savedString ? JSON.parse(savedString) : [];
      const workflow = saved.find((w: any) => w.id === workflowId);
      if (workflow) {
        setWorkflowName(workflow.name || 'Workflow');
      }
    } catch (error) {
      console.error('Error loading workflow:', error);
    }
  }, [workflowId]);

  const handleSaveAutomation = (automation: any) => {
    // Add workflowId to the automation
    const completeAutomation = {
      ...automation,
      workflowId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    try {
      const automationsString = localStorage.getItem('canvasAutomations');
      const automations = automationsString ? JSON.parse(automationsString) : [];
      automations.push(completeAutomation);
      localStorage.setItem('canvasAutomations', JSON.stringify(automations));
    } catch (error) {
      console.error('Error saving automation:', error);
    }
    
    // Show success toast
    toast({
      title: "Automation Created",
      description: `"${automation.name}" has been successfully created.`,
    });
    
    onClose();
  };

  return (
    <>
      <AutomationDialog
        open={isDialogOpen}
        onClose={onClose}
        onSave={handleSaveAutomation}
        workflowName={workflowName}
      />
    </>
  );
};

export default CreateAutomationCanvas;
