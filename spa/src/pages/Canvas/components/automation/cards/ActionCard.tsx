
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActionCardProps {
  selectedActionType: string;
  onActionTypeChange: (value: string) => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  selectedActionType,
  onActionTypeChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Action</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Action Type</Label>
          <Select value={selectedActionType} onValueChange={onActionTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select action type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Send Email</SelectItem>
              <SelectItem value="notification">Send Notification</SelectItem>
              <SelectItem value="export">Export Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedActionType === 'email' && (
          <>
            <div>
              <Label>Send Email</Label>
              <Input placeholder="E.g., example@email.com" />
            </div>
            <div>
              <Label>Subject</Label>
              <Input placeholder="Enter email subject" />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea placeholder="Type email body here..." className="min-h-[100px]" />
            </div>
            <div>
              <Label>Attachments</Label>
              <div className="flex items-center space-x-2 mt-2">
                <input type="checkbox" id="file-upload" />
                <Label htmlFor="file-upload" className="cursor-pointer">File upload</Label>
              </div>
            </div>
          </>
        )}

        <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Action</Button>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
