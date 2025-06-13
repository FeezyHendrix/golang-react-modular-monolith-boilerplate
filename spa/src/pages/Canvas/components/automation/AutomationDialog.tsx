
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AutomationName } from "./AutomationName";
import { AutomationConfigTabs } from "./AutomationConfigTabs";
import { AutomationDialogFooter } from "./AutomationDialogFooter";
import { useAutomationDialog } from "./useAutomationDialog";
import type { AutomationConfig } from '../../types/automation';

interface AutomationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: AutomationConfig) => void;
  workflowName?: string;
  existingConfig?: AutomationConfig; // For edit mode
}

export function AutomationDialog({ 
  open, 
  onClose, 
  onSave, 
  workflowName = "Workflow", 
  existingConfig 
}: AutomationDialogProps) {
  const {
    currentTab,
    setCurrentTab,
    automationName,
    setAutomationName,
    isEditMode,
    handleSectionValidated,
    prepareAutomationConfig,
    isSaveDisabled
  } = useAutomationDialog(existingConfig, workflowName);

  const handleSave = () => {
    const automation = prepareAutomationConfig();
    if (automation) {
      onSave(automation);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit' : 'Configure'} Automation</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update' : 'Set up'} your automation workflow step by step
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mb-4">
          <AutomationName 
            automationName={automationName}
            setAutomationName={setAutomationName}
          />
        </div>

        <AutomationConfigTabs 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onSectionValidated={handleSectionValidated}
          existingConfig={existingConfig}
        />

        <AutomationDialogFooter 
          onClose={onClose}
          handleSave={handleSave}
          isEditMode={isEditMode}
          isSaveDisabled={isSaveDisabled}
        />
      </DialogContent>
    </Dialog>
  );
}
