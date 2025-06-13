
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AutomationNameProps {
  automationName: string;
  setAutomationName: (name: string) => void;
}

export const AutomationName: React.FC<AutomationNameProps> = ({ 
  automationName, 
  setAutomationName 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="automation-name">Automation Name</Label>
      <Input 
        id="automation-name" 
        value={automationName} 
        onChange={(e) => setAutomationName(e.target.value)}
        className="w-full"
      />
    </div>
  );
};
