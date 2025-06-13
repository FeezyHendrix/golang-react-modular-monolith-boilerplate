
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AutomationDialogFooterProps {
  onClose: () => void;
  handleSave: () => void;
  isEditMode: boolean;
  isSaveDisabled: boolean;
}

export const AutomationDialogFooter: React.FC<AutomationDialogFooterProps> = ({
  onClose,
  handleSave,
  isEditMode,
  isSaveDisabled
}) => {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button 
        onClick={handleSave}
        disabled={isSaveDisabled}
      >
        {isEditMode ? 'Update' : 'Save'} Automation
      </Button>
    </DialogFooter>
  );
};
