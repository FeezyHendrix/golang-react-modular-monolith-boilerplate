
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExportConfigProps {
  onConfigChange: (config: any) => void;
  initialConfig?: any;
}

export const ExportConfig: React.FC<ExportConfigProps> = ({ onConfigChange, initialConfig }) => {
  const [format, setFormat] = useState<'CSV' | 'Excel' | 'PDF'>('CSV');
  const [filename, setFilename] = useState("");
  const [destinationFolder, setDestinationFolder] = useState("");
  
  useEffect(() => {
    if (initialConfig) {
      setFormat(initialConfig.format || 'CSV');
      setFilename(initialConfig.filename || "");
      setDestinationFolder(initialConfig.destinationFolder || "");
    }
  }, [initialConfig]);

  const handleApply = () => {
    // Simple validation
    if (!filename) {
      return; // Consider showing an error message
    }
    
    onConfigChange({
      format,
      filename,
      destinationFolder
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Export Configuration</CardTitle>
        <CardDescription>
          Configure how and where to export data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="export-format">Format</Label>
          <Select 
            value={format} 
            onValueChange={(value) => setFormat(value as 'CSV' | 'Excel' | 'PDF')}
          >
            <SelectTrigger id="export-format" className="w-full">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CSV">CSV</SelectItem>
              <SelectItem value="Excel">Excel</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="export-filename">Filename</Label>
          <Input
            id="export-filename"
            placeholder="e.g., Sales_Report_{{date}}"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="export-folder">Destination Folder</Label>
          <Input
            id="export-folder"
            placeholder="e.g., /exports/reports/"
            value={destinationFolder}
            onChange={(e) => setDestinationFolder(e.target.value)}
          />
        </div>
        
        <Button onClick={handleApply} className="w-full">
          Apply Export Configuration
        </Button>
      </CardContent>
    </Card>
  );
};
