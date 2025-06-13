import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface WorkflowRunOptions {
  name?: string;
  description?: string;
  // Other properties would be here
}

interface RunWorkflowDialogProps {
  open: boolean;
  onClose: () => void;
  onRun: (options: WorkflowRunOptions) => void;
  isLoading: boolean;
}

const RunWorkflowDialog: React.FC<RunWorkflowDialogProps> = ({
  open,
  onClose,
  onRun,
  isLoading
}) => {
  const [options, setOptions] = useState<WorkflowRunOptions>({
    name: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRun(options);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run Workflow</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="run-name">Run Name (optional)</Label>
              <Input
                id="run-name"
                value={options.name || ''}
                onChange={(e) => setOptions({ ...options, name: e.target.value })}
                placeholder="Enter a name for this run"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="run-description">Description (optional)</Label>
              <Textarea
                id="run-description"
                value={options.description || ''}
                onChange={(e) => setOptions({ ...options, description: e.target.value })}
                placeholder="Enter a description for this run"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Running...' : 'Run Now'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RunWorkflowDialog;
