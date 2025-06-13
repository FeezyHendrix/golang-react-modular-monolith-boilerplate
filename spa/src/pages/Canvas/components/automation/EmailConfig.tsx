
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EmailConfigProps {
  onConfigChange: (config: any) => void;
  initialConfig?: any;
}

export const EmailConfig: React.FC<EmailConfigProps> = ({ onConfigChange, initialConfig }) => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  
  useEffect(() => {
    if (initialConfig) {
      setTo(initialConfig.to || "");
      setSubject(initialConfig.subject || "");
      setBody(initialConfig.body || "");
    }
  }, [initialConfig]);

  const handleApply = () => {
    // Simple validation
    if (!to || !subject || !body) {
      return; // Consider showing an error message
    }
    
    onConfigChange({
      to,
      subject,
      body
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Email Configuration</CardTitle>
        <CardDescription>
          Set up email notifications for this automation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-to">To</Label>
          <Input
            id="email-to"
            placeholder="recipient@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email-subject">Subject</Label>
          <Input
            id="email-subject"
            placeholder="Automation Report - {current_date}"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email-body">Body</Label>
          <Textarea
            id="email-body"
            rows={6}
            placeholder="The automation has completed successfully. Please find the attached report."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        
        <Button onClick={handleApply} className="w-full">
          Apply Email Configuration
        </Button>
      </CardContent>
    </Card>
  );
};
