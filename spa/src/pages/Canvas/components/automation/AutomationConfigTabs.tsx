
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduleTrigger } from "./ScheduleTrigger";
import { EmailConfig } from "./EmailConfig";
import { ExportConfig } from "./ExportConfig";

interface AutomationConfigTabsProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSectionValidated: (section: string, config: any) => void;
  existingConfig?: any;
}

export const AutomationConfigTabs: React.FC<AutomationConfigTabsProps> = ({
  currentTab,
  setCurrentTab,
  onSectionValidated,
  existingConfig
}) => {
  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <TabsList>
        <TabsTrigger value="trigger">Schedule Trigger</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
      </TabsList>

      <TabsContent value="trigger" className="space-y-4">
        <ScheduleTrigger 
          onConfigChange={(config) => onSectionValidated('trigger', config)} 
          initialConfig={existingConfig?.trigger}
        />
      </TabsContent>

      <TabsContent value="email" className="space-y-4">
        <EmailConfig 
          onConfigChange={(config) => onSectionValidated('email', config)} 
          initialConfig={existingConfig?.email}
        />
      </TabsContent>

      <TabsContent value="export" className="space-y-4">
        <ExportConfig 
          onConfigChange={(config) => onSectionValidated('export', config)} 
          initialConfig={existingConfig?.export}
        />
      </TabsContent>
    </Tabs>
  );
};
