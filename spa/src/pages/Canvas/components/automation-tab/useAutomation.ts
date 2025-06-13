
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AutomationConfig } from '../../types/automation';
import { SavedWorkflow } from '../../types';

export const useAutomation = (workflowId?: string | null) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('workflows');
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([]);
  const [automations, setAutomations] = useState<AutomationConfig[]>([]);
  const [automationHistory, setAutomationHistory] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<AutomationConfig | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved workflows
    try {
      const savedString = localStorage.getItem('savedCanvases');
      const saved = savedString ? JSON.parse(savedString) : [];
      setSavedWorkflows(saved);
    } catch (error) {
      console.error('Error loading saved workflows:', error);
      setSavedWorkflows([]);
    }

    // Load automations
    try {
      const automationsString = localStorage.getItem('canvasAutomations');
      const savedAutomations = automationsString ? JSON.parse(automationsString) : [];
      setAutomations(savedAutomations);
    } catch (error) {
      console.error('Error loading automations:', error);
      setAutomations([]);
    }

    // Load automation history
    try {
      const historyString = localStorage.getItem('canvasAutomationHistory');
      const history = historyString ? JSON.parse(historyString) : [];
      setAutomationHistory(history);
    } catch (error) {
      console.error('Error loading automation history:', error);
      setAutomationHistory([]);
    }
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  const getWorkflowName = (workflowId?: string) => {
    if (!workflowId) return "Unknown workflow";
    const workflow = savedWorkflows.find(w => w.id === workflowId);
    return workflow?.name || "Unknown workflow";
  };

  const handleEditAutomation = (automation: AutomationConfig) => {
    setSelectedAutomation(automation);
    setIsEditMode(true);
  };

  const handleSaveAutomation = (updatedAutomation: AutomationConfig) => {
    const updatedAutomations = isEditMode 
      ? automations.map(a => a.id === updatedAutomation.id ? updatedAutomation : a)
      : [...automations, updatedAutomation];
    
    setAutomations(updatedAutomations);
    localStorage.setItem('canvasAutomations', JSON.stringify(updatedAutomations));
    
    toast({
      title: isEditMode ? "Automation Updated" : "Automation Created",
      description: `"${updatedAutomation.name}" has been ${isEditMode ? 'updated' : 'created'} successfully.`
    });
    
    setIsEditMode(false);
    setSelectedAutomation(null);
  };

  const toggleAutomationStatus = (automationId: string) => {
    const updatedAutomations = automations.map(automation => {
      if (automation.id === automationId) {
        return {
          ...automation,
          active: !automation.active
        };
      }
      return automation;
    });

    setAutomations(updatedAutomations);
    localStorage.setItem('canvasAutomations', JSON.stringify(updatedAutomations));
    
    const automation = updatedAutomations.find(a => a.id === automationId);
    toast({
      title: automation?.active ? "Automation Activated" : "Automation Deactivated",
      description: `"${automation?.name}" is now ${automation?.active ? 'active' : 'inactive'}.`
    });
  };

  const deleteAutomation = (automationId: string) => {
    const updatedAutomations = automations.filter(a => a.id !== automationId);
    setAutomations(updatedAutomations);
    localStorage.setItem('canvasAutomations', JSON.stringify(updatedAutomations));
    
    toast({
      title: "Automation Deleted",
      description: "The automation has been removed."
    });
  };

  const runAutomationNow = (automation: AutomationConfig) => {
    // Find the workflow associated with this automation
    const workflow = savedWorkflows.find(w => w.id === automation.workflowId);
    if (!workflow) {
      toast({
        title: "Error",
        description: "Associated workflow not found.",
        variant: "destructive"
      });
      return;
    }

    // Update last run timestamp
    const updatedAutomations = automations.map(a => {
      if (a.id === automation.id) {
        return {
          ...a,
          lastRun: new Date().toISOString()
        };
      }
      return a;
    });
    setAutomations(updatedAutomations);
    localStorage.setItem('canvasAutomations', JSON.stringify(updatedAutomations));

    // Add to history
    const newHistoryEntry = {
      id: `history-${Date.now()}`,
      automationId: automation.id,
      automationName: automation.name,
      triggerType: 'manual',
      status: 'success',
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [newHistoryEntry, ...automationHistory];
    setAutomationHistory(updatedHistory);
    localStorage.setItem('canvasAutomationHistory', JSON.stringify(updatedHistory));

    toast({
      title: "Automation Triggered",
      description: `"${automation.name}" was executed successfully.`
    });
  };

  // Filter history based on search term
  const filteredHistory = automationHistory.filter(entry => {
    const searchLower = searchTerm.toLowerCase();
    return (
      entry.automationName?.toLowerCase().includes(searchLower)
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    activeSubTab,
    setActiveSubTab,
    automations,
    automationHistory: filteredHistory,
    isEditMode,
    setIsEditMode,
    selectedAutomation,
    setSelectedAutomation,
    formatDate,
    getWorkflowName,
    handleEditAutomation,
    handleSaveAutomation,
    toggleAutomationStatus,
    deleteAutomation,
    runAutomationNow
  };
};
