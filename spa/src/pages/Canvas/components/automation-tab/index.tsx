
import React from 'react';
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { AutomationDialog } from '../automation/AutomationDialog';
import { useAutomation } from './useAutomation';
import AutomationList from './AutomationList';
import HistoryTable from './HistoryTable';

interface AutomationTabProps {
  workflowId?: string | null;
}

const AutomationTab: React.FC<AutomationTabProps> = ({ workflowId }) => {
  const {
    searchTerm,
    setSearchTerm,
    activeSubTab,
    setActiveSubTab,
    automations,
    automationHistory,
    isEditMode,
    setIsEditMode,
    selectedAutomation,
    setSelectedAutomation,
    formatDate,
    getWorkflowName,
    handleEditAutomation,
    handleSaveAutomation,
    toggleAutomationStatus,
    deleteAutomation,
    runAutomationNow
  } = useAutomation(workflowId);

  return (
    <div className="space-y-4">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workflows">Automations</TabsTrigger>
          <TabsTrigger value="tracker">Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows">
          <AutomationList
            automations={automations}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEdit={handleEditAutomation}
            onToggleStatus={toggleAutomationStatus}
            onDelete={deleteAutomation}
            onRun={runAutomationNow}
            getWorkflowName={getWorkflowName}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="tracker">
          <HistoryTable 
            history={automationHistory}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>

      {/* Edit mode dialog */}
      {isEditMode && selectedAutomation && (
        <AutomationDialog
          open={isEditMode}
          onClose={() => {
            setIsEditMode(false);
            setSelectedAutomation(null);
          }}
          onSave={handleSaveAutomation}
          workflowName={getWorkflowName(selectedAutomation.workflowId)}
          existingConfig={selectedAutomation}
        />
      )}
    </div>
  );
};

export default AutomationTab;
