
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type ShareDialogProps = {
  showShareDialog: boolean;
  setShowShareDialog: (show: boolean) => void;
  searchUser: string;
  setSearchUser: (search: string) => void;
  filteredUsers: User[];
  handleShareConfirm: () => void;
};

const ShareDialog: React.FC<ShareDialogProps> = ({
  showShareDialog,
  setShowShareDialog,
  searchUser,
  setSearchUser,
  filteredUsers,
  handleShareConfirm,
}) => {
  return (
    <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Share with Team Members</DialogTitle>
          <DialogDescription>
            Select users to share this insight with.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search-user">Search Users</Label>
            <Input 
              id="search-user" 
              value={searchUser} 
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Search by name or email"
            />
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
            {filteredUsers.map(user => (
              <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                <Checkbox id={`user-${user.id}`} />
                <div className="flex-1">
                  <Label htmlFor={`user-${user.id}`} className="font-medium cursor-pointer">
                    {user.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{user.email} • {user.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowShareDialog(false)}>Cancel</Button>
          <Button onClick={handleShareConfirm}>Share</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
