
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UnlinkConnectionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const UnlinkConnectionDialog: React.FC<UnlinkConnectionDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unlink Connection</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-base">Are you sure you want to unlink this connection?</div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onConfirm}>
              Unlink
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnlinkConnectionDialog;
