
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SaveDialogProps = {
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  insightName: string;
  setInsightName: (name: string) => void;
  insightDescription: string;
  setInsightDescription: (description: string) => void;
  insightCategory: string;
  setInsightCategory: (category: string) => void;
  insightPriority: string;
  setInsightPriority: (priority: string) => void;
  handleSaveConfirm: () => void;
};

const SaveDialog: React.FC<SaveDialogProps> = ({
  showSaveDialog,
  setShowSaveDialog,
  insightName,
  setInsightName,
  insightDescription,
  setInsightDescription,
  insightCategory,
  setInsightCategory,
  insightPriority,
  setInsightPriority,
  handleSaveConfirm,
}) => {
  return (
    <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Save Insight</DialogTitle>
          <DialogDescription>
            Save this insight to your collection for future reference.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="insight-name">Insight Name</Label>
            <Input 
              id="insight-name" 
              value={insightName} 
              onChange={(e) => setInsightName(e.target.value)}
              placeholder="Enter a name for this insight"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="insight-description">Description</Label>
            <Textarea 
              id="insight-description" 
              value={insightDescription} 
              onChange={(e) => setInsightDescription(e.target.value)}
              placeholder="Enter a description for this insight"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insight-category">Category</Label>
              <Input 
                id="insight-category" 
                value={insightCategory} 
                onChange={(e) => setInsightCategory(e.target.value)}
                placeholder="e.g., Sales, Finance"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="insight-priority">Priority</Label>
              <Select value={insightPriority} onValueChange={setInsightPriority}>
                <SelectTrigger id="insight-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveConfirm}>Save Insight</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDialog;
