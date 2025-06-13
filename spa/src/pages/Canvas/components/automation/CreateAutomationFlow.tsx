
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentationTab from '../DocumentationTab';
import AutomationDetails from './cards/AutomationDetails';
import TriggerCard from './cards/TriggerCard';
import ActionCard from './cards/ActionCard';
import ConditionCard from './cards/ConditionCard';
import UtilityCard from './cards/UtilityCard';

interface CreateAutomationFlowProps {
  onClose: () => void;
  onSave: (automation: any) => void;
}

const CreateAutomationFlow: React.FC<CreateAutomationFlowProps> = ({ onClose, onSave }) => {
  const [currentTab, setCurrentTab] = useState('build');
  const [automationName, setAutomationName] = useState('');
  const [automationDescription, setAutomationDescription] = useState('');
  const [selectedTriggerType, setSelectedTriggerType] = useState('');
  const [selectedActionType, setSelectedActionType] = useState('');
  const [selectedUtilityType, setSelectedUtilityType] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create Automation</h1>
          <p className="text-muted-foreground">
            Build your automation workflow step by step
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ name: automationName })}>Create</Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="build">Build Workflow</TabsTrigger>
          <TabsTrigger value="history">Test & Run History</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="space-y-6">
          <AutomationDetails 
            automationName={automationName}
            automationDescription={automationDescription}
            onNameChange={setAutomationName}
            onDescriptionChange={setAutomationDescription}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trigger Card */}
            <TriggerCard 
              selectedTriggerType={selectedTriggerType}
              onTriggerTypeChange={setSelectedTriggerType}
            />

            {/* Action Card */}
            <ActionCard 
              selectedActionType={selectedActionType}
              onActionTypeChange={setSelectedActionType}
            />

            {/* Condition Card */}
            <ConditionCard />

            {/* Utility Card */}
            <UtilityCard 
              selectedUtilityType={selectedUtilityType}
              onUtilityTypeChange={setSelectedUtilityType}
            />
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Test & Run History</h3>
            </div>
            <div className="card-content">
              <p className="text-center text-muted-foreground py-8">
                No execution history available yet
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="docs">
          <DocumentationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateAutomationFlow;
