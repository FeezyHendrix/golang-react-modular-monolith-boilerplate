
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { AutomationConfig } from '../../types/automation';

export const useAutomationDialog = (
  existingConfig?: AutomationConfig,
  workflowName: string = "Workflow"
) => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('trigger');
  const [config, setConfig] = useState<Partial<AutomationConfig>>({});
  const [automationName, setAutomationName] = useState('');
  const [validatedSections, setValidatedSections] = useState<string[]>([]);
  const isEditMode = !!existingConfig;

  // Generate incremental automation name on first render
  useEffect(() => {
    if (existingConfig) {
      // Edit mode - use existing values
      setConfig(existingConfig);
      setAutomationName(existingConfig.name);
      
      // Prefill validated sections based on what we have
      const sections: string[] = [];
      if (existingConfig.trigger) sections.push('trigger');
      if (existingConfig.email) sections.push('email');
      if (existingConfig.export) sections.push('export');
      setValidatedSections(sections);
    } else {
      // Create mode - generate name with incremental number
      const generateAutomationName = () => {
        // Get existing automations
        const existingAutomations = JSON.parse(localStorage.getItem('canvasAutomations') || '[]');
        
        // Find next number
        const nextNumber = existingAutomations.length + 1;
        const formattedNumber = String(nextNumber).padStart(4, '0');
        
        return `${workflowName || 'Workflow'}-${formattedNumber}`;
      };
      
      setAutomationName(generateAutomationName());
    }
  }, [existingConfig, workflowName]);

  const handleSectionValidated = (section: string, newConfig: any) => {
    setConfig(prev => ({ ...prev, [section]: newConfig }));
    if (!validatedSections.includes(section)) {
      setValidatedSections(prev => [...prev, section]);
    }
  };

  const prepareAutomationConfig = (): AutomationConfig | null => {
    if (validatedSections.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please apply and validate at least one section",
        variant: "destructive"
      });
      return null;
    }

    return {
      id: existingConfig?.id || crypto.randomUUID(),
      name: automationName,
      active: existingConfig?.active ?? true,
      triggerType: config.triggerType || 'schedule',
      trigger: config.trigger!,
      email: config.email,
      export: config.export,
      lastRun: existingConfig?.lastRun,
      workflowId: existingConfig?.workflowId
    };
  };

  return {
    currentTab,
    setCurrentTab,
    config,
    automationName,
    setAutomationName,
    validatedSections,
    isEditMode,
    handleSectionValidated,
    prepareAutomationConfig,
    isSaveDisabled: validatedSections.length === 0 || !automationName
  };
};
