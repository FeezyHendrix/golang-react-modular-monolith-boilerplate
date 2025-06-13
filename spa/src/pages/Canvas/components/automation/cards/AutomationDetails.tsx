
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AutomationDetailsProps {
  automationName: string;
  automationDescription: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const AutomationDetails: React.FC<AutomationDetailsProps> = ({
  automationName,
  automationDescription,
  onNameChange,
  onDescriptionChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={automationName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter automation name"
            />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={automationDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Describe what this automation does"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationDetails;
