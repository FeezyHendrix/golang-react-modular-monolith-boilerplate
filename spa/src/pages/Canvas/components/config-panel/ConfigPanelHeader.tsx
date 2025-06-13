
import React from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConfigPanelHeaderProps {
  title: string;
  onClose: () => void;
  onTogglePop: () => void;
  isPoppedOut: boolean;
}

const ConfigPanelHeader = React.memo(({ 
  title, 
  onClose, 
  onTogglePop, 
  isPoppedOut 
}: ConfigPanelHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onTogglePop}
              >
                {isPoppedOut ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isPoppedOut ? "Minimize panel" : "Expand to full screen"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
              >
                <X size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
});

ConfigPanelHeader.displayName = 'ConfigPanelHeader';

export default ConfigPanelHeader;
