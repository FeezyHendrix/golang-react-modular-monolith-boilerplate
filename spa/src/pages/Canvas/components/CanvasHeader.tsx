
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Play, Trash2 } from 'lucide-react';

interface CanvasHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onClear: () => void;
  onSave: () => void;
  onRun: () => void;
}

const CanvasHeader: React.FC<CanvasHeaderProps> = ({
  activeTab,
  onTabChange,
  onClear,
  onSave,
  onRun,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="saved-workflows">Saved Workflows</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClear}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button variant="outline" onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button onClick={onRun}>
          <Play className="w-4 h-4 mr-2" />
          Run
        </Button>
      </div>
    </div>
  );
};

export default CanvasHeader;
