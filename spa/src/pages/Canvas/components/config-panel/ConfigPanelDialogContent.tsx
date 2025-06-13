
import React from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ConfigPanelDialogContentProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  isLoading: boolean;
  progress: number;
}

const ConfigPanelDialogContent = React.memo(({ 
  title,
  onClose,
  children,
  isLoading,
  progress
}: ConfigPanelDialogContentProps) => {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </div>
      {isLoading && <Progress value={progress} className="w-full mb-4" />}
      <ScrollArea className="flex-1 h-[calc(90vh-120px)] pr-4">
        {children}
      </ScrollArea>
    </DialogContent>
  );
});

ConfigPanelDialogContent.displayName = 'ConfigPanelDialogContent';

export default ConfigPanelDialogContent;
