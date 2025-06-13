
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TriggerCardProps {
  selectedTriggerType: string;
  onTriggerTypeChange: (value: string) => void;
}

const TriggerCard: React.FC<TriggerCardProps> = ({
  selectedTriggerType,
  onTriggerTypeChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trigger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Action Type</Label>
          <Select value={selectedTriggerType} onValueChange={onTriggerTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select action type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="schedule">Schedule Trigger</SelectItem>
              <SelectItem value="file-upload">File Upload Trigger</SelectItem>
              <SelectItem value="data-update">Data Update Trigger</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedTriggerType === 'schedule' && (
          <>
            <div>
              <Label>Schedule Trigger</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select action type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {selectedTriggerType === 'file-upload' && (
          <>
            <div>
              <Label>Send Email</Label>
              <Input placeholder="e.g., csv, xx.lxx, .jpg" />
            </div>
            <div>
              <Label>Destination Folder</Label>
              <Input placeholder="Optional: Enter folder path" />
            </div>
          </>
        )}

        {selectedTriggerType === 'data-update' && (
          <>
            <div>
              <Label>Data Source</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose data source..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Resource ID</Label>
              <Input placeholder="Enter table name or collection ID" />
            </div>
          </>
        )}

        <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Action</Button>
      </CardContent>
    </Card>
  );
};

export default TriggerCard;
