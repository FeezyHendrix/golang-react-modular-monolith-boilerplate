
import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OperatorStatus } from '../../types';

interface ConfigPanelSaveButtonProps {
  status: OperatorStatus;
  onSave: () => void;
  isLoading: boolean;
  componentHandlesSave: boolean;
}

const ConfigPanelSaveButton = React.memo(({ 
  status, 
  onSave, 
  isLoading, 
  componentHandlesSave 
}: ConfigPanelSaveButtonProps) => {
  if (componentHandlesSave) {
    return null;
  }

  const isConfigured = status === OperatorStatus.CONFIGURED;
  const buttonText = isConfigured ? 'Update' : 'Save';

  return (
    <Button 
      className="w-full mt-8" 
      onClick={onSave}
      disabled={isLoading}
    >
      <Save className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
});

ConfigPanelSaveButton.displayName = 'ConfigPanelSaveButton';

export default ConfigPanelSaveButton;
