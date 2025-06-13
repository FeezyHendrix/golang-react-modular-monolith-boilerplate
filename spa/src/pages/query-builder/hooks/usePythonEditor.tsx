
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { codeTemplates } from '../utils/codeTemplates';

const usePythonEditor = () => {
  const { toast } = useToast();
  const [localTemplates, setLocalTemplates] = useState<Record<string, string>>({});
  
  const [pythonCode, setPythonCode] = useState<string>(
    `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt`
  );

  const applyTemplate = (templateName: string) => {
    const allTemplates = { ...codeTemplates, ...localTemplates };
    const template = allTemplates[templateName];
    
    if (!template) {
      toast({
        title: "Template not found",
        description: "The selected template was not found."
      });
      return;
    }
    
    setPythonCode(template);
    
    toast({
      title: "Template applied",
      description: `The ${templateName} template was applied successfully.`
    });
  };

  const addTemplate = (name: string, code: string) => {
    setLocalTemplates(prev => ({
      ...prev,
      [name]: code
    }));
  };

  // Merge built-in templates with local templates
  const allTemplates = { ...codeTemplates, ...localTemplates };

  return {
    pythonCode,
    setPythonCode,
    applyTemplate,
    codeTemplates: allTemplates,
    addTemplate
  };
};

export default usePythonEditor;
