
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { WorkflowNode } from './types';
import { nodeDefinitions } from './nodeDefinitions';
import { DataSource } from '@/hooks/useAppDataStore';
import { X, Play, Settings } from 'lucide-react';

interface NodeConfigPanelProps {
  node: WorkflowNode;
  availableSources: WorkflowNode[];
  dataSources: DataSource[];
  onUpdateNode: (node: WorkflowNode) => void;
  onTestNode: (nodeId: string, testData: any) => Promise<any>;
  onClose: () => void;
  isRunning: boolean;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({
  node,
  availableSources,
  dataSources,
  onUpdateNode,
  onTestNode,
  onClose,
  isRunning
}) => {
  const [isRunningTest, setIsRunningTest] = React.useState(false);
  const [testData, setTestData] = React.useState<string>('{}');
  
  // Find the node definition
  const definition = nodeDefinitions.find(def => def.type === node.type);
  
  if (!definition) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Node Configuration</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-muted-foreground">
          No configuration available for this node type.
        </div>
      </div>
    );
  }
  
  const handleConfigChange = (field: string, value: any) => {
    onUpdateNode({
      ...node,
      configuration: {
        ...node.configuration,
        [field]: value
      }
    });
  };
  
  const handleToggleEnabled = () => {
    onUpdateNode({
      ...node,
      enabled: !node.enabled
    });
  };
  
  const handleRunTest = async () => {
    if (isRunning || isRunningTest) return;
    
    setIsRunningTest(true);
    try {
      let parsedTestData = {};
      try {
        parsedTestData = JSON.parse(testData);
      } catch (e) {
        console.error('Invalid JSON test data', e);
      }
      
      await onTestNode(node.id, parsedTestData);
    } catch (error) {
      console.error('Error testing node', error);
    } finally {
      setIsRunningTest(false);
    }
  };
  
  const renderConfigField = (field: any) => {
    const { name, label, type, required, placeholder, options, hint, default: defaultValue } = field;
    const value = node.configuration[name] !== undefined 
      ? node.configuration[name] 
      : defaultValue;
    
    switch (type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={name}
              type={type}
              value={value || ''}
              placeholder={placeholder}
              onChange={(e) => handleConfigChange(name, e.target.value)}
              disabled={isRunning}
              className="w-full"
            />
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
        );
        
      case 'number':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={name}
              type="number"
              value={value || ''}
              placeholder={placeholder}
              onChange={(e) => handleConfigChange(name, Number(e.target.value))}
              disabled={isRunning}
              className="w-full"
            />
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
        );
        
      case 'select':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select 
              value={value || defaultValue} 
              onValueChange={(val) => handleConfigChange(name, val)}
              disabled={isRunning}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder || `Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
        );
        
      case 'textarea':
      case 'json':
      case 'code':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={name}
              value={value || ''}
              placeholder={placeholder}
              onChange={(e) => handleConfigChange(name, e.target.value)}
              className="min-h-24 w-full"
              disabled={isRunning}
            />
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
        );
        
      case 'boolean':
        return (
          <div key={name} className="flex items-center justify-between">
            <div>
              <Label htmlFor={name} className="cursor-pointer">
                {label}
              </Label>
              {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            </div>
            <Switch
              id={name}
              checked={value || false}
              onCheckedChange={(checked) => handleConfigChange(name, checked)}
              disabled={isRunning}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Configure {node.label}
          </h3>
          <p className="text-xs text-muted-foreground">{definition.description}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="node-enabled">Node Enabled</Label>
          <Switch
            id="node-enabled"
            checked={node.enabled}
            onCheckedChange={handleToggleEnabled}
            disabled={isRunning}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Node Configuration</h4>
          {definition.configFields.map(renderConfigField)}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Test Node</h4>
          <div className="space-y-2">
            <Label htmlFor="test-data">Test Data (JSON)</Label>
            <Textarea
              id="test-data"
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              placeholder='{"key": "value"}'
              className="min-h-24 w-full"
              disabled={isRunning || isRunningTest}
            />
            <p className="text-xs text-muted-foreground">
              Enter JSON data to test this node with
            </p>
          </div>
          
          <Button 
            onClick={handleRunTest}
            disabled={isRunning || isRunningTest}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunningTest ? 'Running...' : 'Test Node'}
          </Button>
          
          {node.testResult && (
            <div className="border rounded-md p-3 mt-4">
              <h5 className="text-sm font-medium mb-1">Test Result:</h5>
              <pre className="text-xs overflow-auto max-h-40 p-2 bg-muted rounded">
                {JSON.stringify(node.testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        {node.status === 'error' && node.testResult?.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
            <h5 className="text-sm font-medium text-red-800 mb-1">Error:</h5>
            <p className="text-xs text-red-600">
              {node.testResult.error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeConfigPanel;
