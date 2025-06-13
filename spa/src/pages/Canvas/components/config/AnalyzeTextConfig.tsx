import React, { useState } from 'react';
import { AnalyzeTextOperatorData, AnalysisType, SummaryLength, OperatorStatus } from '../../types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AnalyzeTextConfigProps {
  operator: AnalyzeTextOperatorData;
  onUpdateOperator: (operator: AnalyzeTextOperatorData) => void;
  getAvailableColumns?: (operatorId: string) => string[];
  connectedOperators?: any[];
}

const AnalyzeTextConfig: React.FC<AnalyzeTextConfigProps> = ({ 
  operator, 
  onUpdateOperator,
  getAvailableColumns,
  connectedOperators
}) => {
  const [availableColumns, setAvailableColumns] = useState<string[]>([
    'text', 'description', 'comment', 'feedback', 'content', 'review', 'message', 'comments', 
    'reviews', 'article', 'email', 'subject', 'body'
  ]);

  // Try to get actual columns from connected operator
  React.useEffect(() => {
    const incomingColumns = getAvailableColumns?.(operator.id) || [];
    if (incomingColumns && incomingColumns.length > 0) {
      setAvailableColumns(incomingColumns);
    }
  }, [operator.id, getAvailableColumns]);

  const handleAnalysisTypeChange = (value: string) => {
    onUpdateOperator({
      ...operator,
      analysisType: value as AnalysisType,
      // Initialize default settings for the analysis type
      options: value === AnalysisType.SENTIMENT 
        ? { outputType: 'label', confidenceThreshold: 80 }
        : value === AnalysisType.KEYWORD
        ? { autoExtractCount: 10, contextWindow: 'medium' }
        : value === AnalysisType.ENTITY
        ? { extractEntities: { people: true, organizations: true, locations: true, dates: true, custom: [], events: false, money: false }, showConfidence: false }
        : value === AnalysisType.LANGUAGE
        ? { returnFullLanguageName: true, confidenceThreshold: 70 }
        : {}
    });
  };

  const handleTextFieldChange = (value: string) => {
    onUpdateOperator({
      ...operator,
      textField: value
    });
  };

  const renderAnalysisTypeConfig = () => {
    switch(operator.analysisType) {
      case AnalysisType.SENTIMENT:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-3">
              Detect sentiment (positive, negative, neutral) in text for fraud or anomaly detection.
            </p>
            <div className="space-y-2">
              <Label className="text-sm">Output Type</Label>
              <Select 
                value={operator.options?.outputType || 'label'}
                onValueChange={(value) => {
                  onUpdateOperator({
                    ...operator,
                    options: {
                      ...operator.options,
                      outputType: value as 'label' | 'score'
                    }
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select output type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="label">Label (positive/negative/neutral)</SelectItem>
                  <SelectItem value="score">Score (-1.0 to 1.0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm">Confidence Threshold</Label>
                <span className="text-xs text-muted-foreground">{operator.options?.confidenceThreshold || 80}%</span>
              </div>
              <Slider 
                value={[operator.options?.confidenceThreshold || 80]} 
                min={0} 
                max={100} 
                step={1} 
                onValueChange={(values) => {
                  onUpdateOperator({
                    ...operator,
                    options: {
                      ...operator.options,
                      confidenceThreshold: values[0]
                    }
                  });
                }}
              />
            </div>
          </div>
        );

      case AnalysisType.ENTITY:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-3">
              Extract specific entities like Organizations and Money from text for event detection.
            </p>
            <div className="space-y-2">
              <Label className="text-sm mb-2 block">Entity Types to Extract</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="people" 
                    checked={operator.options?.extractEntities?.people || false}
                    onCheckedChange={(checked) => {
                      onUpdateOperator({
                        ...operator,
                        options: {
                          ...operator.options,
                          extractEntities: {
                            ...operator.options?.extractEntities,
                            people: Boolean(checked)
                          }
                        }
                      });
                    }} 
                  />
                  <Label htmlFor="people" className="text-sm font-normal">People</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="organizations" 
                    checked={operator.options?.extractEntities?.organizations || false}
                    onCheckedChange={(checked) => {
                      onUpdateOperator({
                        ...operator,
                        options: {
                          ...operator.options,
                          extractEntities: {
                            ...operator.options?.extractEntities,
                            organizations: Boolean(checked)
                          }
                        }
                      });
                    }} 
                  />
                  <Label htmlFor="organizations" className="text-sm font-normal">Organizations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="locations" 
                    checked={operator.options?.extractEntities?.locations || false}
                    onCheckedChange={(checked) => {
                      onUpdateOperator({
                        ...operator,
                        options: {
                          ...operator.options,
                          extractEntities: {
                            ...operator.options?.extractEntities,
                            locations: Boolean(checked)
                          }
                        }
                      });
                    }} 
                  />
                  <Label htmlFor="locations" className="text-sm font-normal">Locations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="dates" 
                    checked={operator.options?.extractEntities?.dates || false}
                    onCheckedChange={(checked) => {
                      onUpdateOperator({
                        ...operator,
                        options: {
                          ...operator.options,
                          extractEntities: {
                            ...operator.options?.extractEntities,
                            dates: Boolean(checked)
                          }
                        }
                      });
                    }} 
                  />
                  <Label htmlFor="dates" className="text-sm font-normal">Dates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="events" 
                    checked={operator.options?.extractEntities?.events || false}
                    onCheckedChange={(checked) => {
                      onUpdateOperator({
                        ...operator,
                        options: {
                          ...operator.options,
                          extractEntities: {
                            ...operator.options?.extractEntities,
                            events: Boolean(checked)
                          }
                        }
                      });
                    }} 
                  />
                  <Label htmlFor="events" className="text-sm font-normal">Events</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="money" 
                    checked={operator.options?.extractEntities?.money || false}
                    onCheckedChange={(checked) => {
                      onUpdateOperator({
                        ...operator,
                        options: {
                          ...operator.options,
                          extractEntities: {
                            ...operator.options?.extractEntities,
                            money: Boolean(checked)
                          }
                        }
                      });
                    }} 
                  />
                  <Label htmlFor="money" className="text-sm font-normal">Monetary Values</Label>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="showConfidence" 
                checked={operator.options?.showConfidence || false}
                onCheckedChange={(checked) => {
                  onUpdateOperator({
                    ...operator,
                    options: {
                      ...operator.options,
                      showConfidence: checked
                    }
                  });
                }}
              />
              <Label htmlFor="showConfidence" className="text-sm font-normal">
                Return Entity Confidence
              </Label>
            </div>
          </div>
        );

      case AnalysisType.KEYWORD:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-3">
              Extract important keywords or key phrases for trend analysis or clustering.
            </p>
            <div className="space-y-2">
              <Label className="text-sm">Search Specific Keywords</Label>
              <Input 
                type="text" 
                placeholder="Enter keywords separated by comma" 
                onChange={(e) => {
                  const keywords = e.target.value.split(',').map(k => k.trim()).filter(Boolean);
                  onUpdateOperator({
                    ...operator,
                    options: {
                      ...operator.options,
                      specificKeywords: keywords.length > 0 ? keywords : undefined
                    }
                  });
                }}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to auto-extract important keywords
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Auto Extract Top Keywords</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={operator.options?.autoExtractCount || 10}
                onChange={(e) => {
                  onUpdateOperator({
                    ...operator,
                    options: {
                      ...operator.options,
                      autoExtractCount: parseInt(e.target.value)
                    }
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Context Window</Label>
              <Select 
                value={operator.options?.contextWindow || 'medium'}
                onValueChange={(value) => {
                  onUpdateOperator({
                    ...operator,
                    options: {
                      ...operator.options,
                      contextWindow: value as 'short' | 'medium' | 'long'
                    }
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select context window" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How much text to consider around keywords
              </p>
            </div>
          </div>
        );

      case AnalysisType.LANGUAGE:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-3">
              Detect language of the text for multilingual datasets.
            </p>
            <div className="flex items-center space-x-2">
              <Switch 
                id="fullLanguageName" 
                checked={operator.options?.returnFullLanguageName || false}
                onCheckedChange={(checked) => {
                  onUpdateOperator({
                    ...operator,
                    options: {
                      ...operator.options,
                      returnFullLanguageName: checked
                    }
                  });
                }}
              />
              <Label htmlFor="fullLanguageName" className="text-sm font-normal">
                Return Full Language Name
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Example: "French" vs "fr"
            </p>
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <Label className="text-sm">Confidence Threshold</Label>
                <span className="text-xs text-muted-foreground">{operator.options?.confidenceThreshold || 70}%</span>
              </div>
              <Slider 
                value={[operator.options?.confidenceThreshold || 70]} 
                min={0} 
                max={100} 
                step={1} 
                onValueChange={(values) => {
                  onUpdateOperator({
                    ...operator,
                    options: {
                      ...operator.options,
                      confidenceThreshold: values[0]
                    }
                  });
                }}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            Select an analysis type to configure.
          </div>
        );
    }
  };

  const handlePreviewAnalysis = () => {
    // In a real implementation, this would call an API to get a preview
    console.log('Preview analysis requested for:', operator);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="textField" className="text-sm font-medium">Select Text Column</Label>
        <Select 
          value={operator.textField || ''}
          onValueChange={handleTextFieldChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select text column" />
          </SelectTrigger>
          <SelectContent>
            {availableColumns.map(column => (
              <SelectItem key={column} value={column}>{column}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <Label htmlFor="analysisType" className="text-sm font-medium">Choose Analysis Type</Label>
        <RadioGroup 
          value={operator.analysisType || ''} 
          onValueChange={handleAnalysisTypeChange}
          className="mt-2 space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={AnalysisType.SENTIMENT} id="sentiment" />
            <Label htmlFor="sentiment">Sentiment Analysis</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={AnalysisType.KEYWORD} id="keyword" />
            <Label htmlFor="keyword">Keyword Extraction</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={AnalysisType.ENTITY} id="entity" />
            <Label htmlFor="entity">Named Entity Recognition (NER)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={AnalysisType.LANGUAGE} id="language" />
            <Label htmlFor="language">Language Detection</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {renderAnalysisTypeConfig()}

      <Separator />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced-options">
          <AccordionTrigger className="text-sm py-2">Advanced Options</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm">Batch Size</Label>
              <Input
                type="number"
                min={100}
                max={5000}
                defaultValue={500}
                disabled
                className="text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">How many rows to process at once</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Language Override</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Auto-detect" />
                </SelectTrigger>
              </Select>
              <p className="text-xs text-muted-foreground">Force assume a specific language</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {operator.analysisType && operator.textField && (
        <>
          <Separator />
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={handlePreviewAnalysis}
          >
            <FileText className="mr-2 h-4 w-4" />
            Preview Analysis
          </Button>
          <Card className="bg-muted/50">
            <CardContent className="p-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Connect to a data source to see actual preview results
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AnalyzeTextConfig;
