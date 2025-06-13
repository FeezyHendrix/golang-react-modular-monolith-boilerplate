
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Code } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const ConditionCard: React.FC = () => {
  const [conditionType, setConditionType] = useState<string>("simple");
  const [field, setField] = useState<string>("");
  const [operator, setOperator] = useState<string>("equals");
  const [value, setValue] = useState<string>("");
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [advancedCondition, setAdvancedCondition] = useState<string>("value > 1000");
  const [isExpressionValid, setIsExpressionValid] = useState<boolean>(true);
  const [showAdvancedEditor, setShowAdvancedEditor] = useState<boolean>(false);
  const { toast } = useToast();

  const handleApplyCondition = () => {
    if (conditionType === "simple") {
      if (!field || !value) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill all required fields"
        });
        return;
      }
    } else {
      if (!isExpressionValid) {
        toast({
          variant: "destructive",
          title: "Invalid Expression",
          description: "Please fix the expression errors"
        });
        return;
      }
    }
    
    toast({
      title: "Condition Applied",
      description: "Your condition has been successfully applied"
    });
  };

  const handleAdvancedConditionChange = (newCondition: string) => {
    setAdvancedCondition(newCondition);
    
    // Simple validation - check for balanced parentheses and basic operators
    try {
      const hasBalancedParentheses = (str: string) => {
        let count = 0;
        for (const char of str) {
          if (char === '(') count++;
          if (char === ')') count--;
          if (count < 0) return false;
        }
        return count === 0;
      };
      
      const hasValidOperators = (str: string) => {
        const operators = ['==', '!=', '>', '<', '>=', '<=', '&&', '||'];
        return operators.some(op => str.includes(op));
      };
      
      setIsExpressionValid(
        hasBalancedParentheses(newCondition) && 
        hasValidOperators(newCondition)
      );
    } catch {
      setIsExpressionValid(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Condition</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-normal">Advanced</span>
              <Switch
                checked={conditionType === "advanced"}
                onCheckedChange={(checked) => setConditionType(checked ? "advanced" : "simple")}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {conditionType === "simple" ? (
            <>
              <div>
                <Label>Field</Label>
                <Select value={field} onValueChange={setField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Operator</Label>
                <Select value={operator} onValueChange={setOperator}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="not_equals">Not Equals</SelectItem>
                    <SelectItem value="greater_than">Greater Than</SelectItem>
                    <SelectItem value="less_than">Less Than</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Value</Label>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter value"
                />
              </div>
            </>
          ) : (
            <div>
              <div className="flex justify-between mb-2">
                <Label>Condition Expression</Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setShowAdvancedEditor(true)}
                >
                  <Code className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
              <div
                className={`p-2 border rounded-md font-mono text-sm ${
                  !isExpressionValid ? 'border-red-500' : ''
                }`}
              >
                {advancedCondition}
              </div>
              {!isExpressionValid && (
                <p className="text-xs text-red-500 mt-1">
                  Invalid expression. Check syntax and operators.
                </p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">True Path</Button>
            <Button variant="outline">False Path</Button>
          </div>
          
          <Button
            onClick={handleApplyCondition}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Apply Condition
          </Button>
        </CardContent>
      </Card>
      
      {/* Advanced Expression Editor Dialog */}
      <Dialog open={showAdvancedEditor} onOpenChange={setShowAdvancedEditor}>
        <DialogContent 
          className="max-w-2xl" 
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Advanced Condition Editor</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Expression</Label>
              <div className="mt-2 border rounded-md bg-muted/30 font-mono relative">
                <textarea
                  value={advancedCondition}
                  onChange={(e) => handleAdvancedConditionChange(e.target.value)}
                  className="w-full p-4 min-h-[200px] bg-transparent font-mono text-sm resize-none outline-none"
                  placeholder="e.g., (sales > 1000 && region == 'North') || date >= '2023-01-01'"
                />
              </div>
              
              <div className="mt-2 text-sm">
                <p className="font-medium">Available operators:</p>
                <ul className="grid grid-cols-2 gap-1 mt-1">
                  <li><code>==</code> (equals)</li>
                  <li><code>!=</code> (not equals)</li>
                  <li><code>&gt;</code> (greater than)</li>
                  <li><code>&lt;</code> (less than)</li>
                  <li><code>&gt;=</code> (greater than or equal)</li>
                  <li><code>&lt;=</code> (less than or equal)</li>
                  <li><code>&&</code> (AND)</li>
                  <li><code>||</code> (OR)</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAdvancedEditor(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (isExpressionValid) {
                    setShowAdvancedEditor(false);
                  } else {
                    toast({
                      variant: "destructive",
                      title: "Invalid Expression",
                      description: "Please fix the expression errors before saving"
                    });
                  }
                }}
                disabled={!isExpressionValid}
              >
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConditionCard;
