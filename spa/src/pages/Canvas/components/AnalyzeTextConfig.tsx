
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the appropriate type for analysis
type AnalysisType = 'sentiment' | 'entities' | 'classification' | 'summarization';

interface AnalyzeTextConfigProps {
  onChange: (config: any) => void;
  initialConfig?: any;
}

const AnalyzeTextConfig: React.FC<AnalyzeTextConfigProps> = ({ onChange, initialConfig }) => {
  const [analysisType, setAnalysisType] = useState<AnalysisType>(initialConfig?.type || 'sentiment');
  const [apiKey, setApiKey] = useState(initialConfig?.apiKey || '');
  
  const handleApply = () => {
    onChange({
      type: analysisType,
      apiKey,
    });
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="analysis-type">Analysis Type</Label>
            <Select
              value={analysisType}
              onValueChange={(value: AnalysisType) => setAnalysisType(value)}
            >
              <SelectTrigger id="analysis-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                <SelectItem value="entities">Entity Extraction</SelectItem>
                <SelectItem value="classification">Text Classification</SelectItem>
                <SelectItem value="summarization">Text Summarization</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key (Optional)</Label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key if required"
            />
          </div>
          
          <Button onClick={handleApply} className="w-full">Apply</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyzeTextConfig;
