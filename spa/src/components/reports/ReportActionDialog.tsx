
import React, { useState } from "react";
import { FileDown, Share, Trash2, FileText, Presentation } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ShareDialog from "@/pages/Decisioning/components/ShareDialog";
import { User } from "@/pages/Decisioning/types";

interface ReportActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle: string;
  reportId: number;
  reportType: 'decision' | 'insight';
}

const ReportActionDialog: React.FC<ReportActionDialogProps> = ({
  open,
  onOpenChange,
  reportTitle,
  reportId,
  reportType
}) => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  
  // Sample users - would normally come from an API
  const users: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Viewer" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "Editor" },
  ];
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchUser.toLowerCase()) || 
    user.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const handleDelete = () => {
    toast({
      title: "Report deleted",
      description: `${reportTitle} has been deleted successfully.`,
    });
    setShowDeleteDialog(false);
    onOpenChange(false);
  };

  const handleShareConfirm = () => {
    toast({
      title: "Report shared",
      description: `${reportTitle} has been shared successfully.`,
    });
    setShowShareDialog(false);
  };

  const handleDownload = (format: 'pdf' | 'ppt') => {
    toast({
      title: `Report downloaded as ${format.toUpperCase()}`,
      description: `${reportTitle} has been downloaded successfully.`,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{reportTitle}</DialogTitle>
            <DialogDescription>
              {reportType === 'decision' ? 'Decision report options' : 'Insight options'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Button 
              onClick={() => setShowDeleteDialog(true)} 
              variant="destructive"
              className="w-full justify-start"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Report
            </Button>
            
            <Button 
              onClick={() => setShowShareDialog(true)} 
              variant="outline"
              className="w-full justify-start"
            >
              <Share className="mr-2 h-4 w-4" />
              Share with Team
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="grid gap-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => handleDownload('pdf')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Download as PDF
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => handleDownload('ppt')}
                  >
                    <Presentation className="mr-2 h-4 w-4" />
                    Download as PowerPoint
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the report
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Share Dialog */}
      <ShareDialog
        showShareDialog={showShareDialog}
        setShowShareDialog={setShowShareDialog}
        searchUser={searchUser}
        setSearchUser={setSearchUser}
        filteredUsers={filteredUsers}
        handleShareConfirm={handleShareConfirm}
      />
    </>
  );
};

export default ReportActionDialog;
