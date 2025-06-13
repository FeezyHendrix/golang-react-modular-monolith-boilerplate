
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useCanvasDialogs() {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isAutomationSheetOpen, setIsAutomationSheetOpen] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [isScriptDialogOpen, setIsScriptDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveWorkflow = useCallback(async (saveCanvas: Function, name: string, description: string) => {
    setIsSaving(true);
    try {
      await saveCanvas(name, description);
      setIsSaveDialogOpen(false);
      toast({
        title: "Workflow saved",
        description: `"${name}" saved successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workflow.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  const handleRunWorkflow = useCallback(async (executeQuery: Function, canvasState: any) => {
    setIsRunning(true);
    try {
      await executeQuery(canvasState);
      setIsRunDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error running workflow",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  }, [toast]);

  return {
    isSaveDialogOpen,
    setIsSaveDialogOpen,
    isRunDialogOpen,
    setIsRunDialogOpen,
    isSaving,
    isRunning,
    isAutomationSheetOpen,
    setIsAutomationSheetOpen,
    selectedWorkflowId,
    setSelectedWorkflowId,
    isScriptDialogOpen,
    setIsScriptDialogOpen,
    handleSaveWorkflow,
    handleRunWorkflow
  };
}
