
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SaveCanvasDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, description?: string) => void;
}

const SaveCanvasDialog: React.FC<SaveCanvasDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter a name for the canvas');
      return;
    }
    
    onSave(name, description);
    setName('');
    setDescription('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Canvas</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="canvas-name">Canvas Name</Label>
            <Input
              id="canvas-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="Enter a name for this canvas"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="canvas-description">Description (Optional)</Label>
            <Textarea
              id="canvas-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for this canvas"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Canvas
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveCanvasDialog;
