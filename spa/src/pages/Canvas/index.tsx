import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCanvas } from './hooks/useCanvas';
import { useCanvasDialogs } from './hooks/useCanvasDialogs';
import CanvasHeader from './components/CanvasHeader';
import CanvasError from './components/CanvasError';
import CanvasContent from './components/CanvasContent';
import PreviewTabs from './components/PreviewTabs';
import SaveWorkflowDialog from './components/SaveWorkflowDialog';
import SavedWorkflows from './components/SavedWorkflows';
import RunWorkflowDialog from './components/RunWorkflowDialog';
import AutomationTab from './components/automation-tab';
import CreateAutomationCanvas from './components/CreateAutomationCanvas';
import { Position, OperatorType } from './types';
import { AutomationDialog } from './components/automation/AutomationDialog';
import type { AutomationConfig } from './types/automation';
import { useToast } from "@/hooks/use-toast";

const Canvas = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('canvas');
  const [activePreviewTab, setActivePreviewTab] = useState('results-preview');
  const [isAutomationOpen, setIsAutomationOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);

  const {
    canvasState,
    selectedOperator,
    generatedSql,
    previewResults,
    isLoading,
    executionError,
    addOperator,
    updateOperator,
    removeOperator,
    selectOperator,
    connectOperators,
    removeConnection,
    executeQuery,
    clearCanvas,
    saveCanvas,
    loadCanvas,
    getAvailableColumns
  } = useCanvas();

  const {
    isSaveDialogOpen,
    setIsSaveDialogOpen,
    isRunDialogOpen,
    setIsRunDialogOpen,
    isSaving,
    isRunning,
    isAutomationSheetOpen,
    setIsAutomationSheetOpen,
    selectedWorkflowId,
    setSelectedWorkflowId,
    handleSaveWorkflow,
    handleRunWorkflow
  } = useCanvasDialogs();

  // Load workflow details when selected
  useEffect(() => {
    if (selectedWorkflowId) {
      try {
        const savedString = localStorage.getItem('savedCanvases');
        const saved = savedString ? JSON.parse(savedString) : [];
        const workflow = saved.find((w: any) => w.id === selectedWorkflowId);
        if (workflow) {
          setSelectedWorkflow(workflow);
        }
      } catch (error) {
        console.error('Error loading workflow:', error);
      }
    } else {
      setSelectedWorkflow(null);
    }
  }, [selectedWorkflowId]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLElement>, position: Position) => {
    const type = e.dataTransfer.getData('application/reactflow');
    if (type) {
      addOperator(type as OperatorType, position);
    }
  }, [addOperator]);

  const handleAutomationClick = useCallback((workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    setIsAutomationOpen(true);
  }, []);

  const handleSaveAutomation = (config: AutomationConfig) => {
    // Add workflow details to the automation
    const completeConfig = {
      ...config,
      workflowId: selectedWorkflowId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const savedAutomations = JSON.parse(localStorage.getItem('canvasAutomations') || '[]');
    savedAutomations.push(completeConfig);
    localStorage.setItem('canvasAutomations', JSON.stringify(savedAutomations));
    
    setIsAutomationOpen(false);
    toast({
      title: "Success",
      description: "Automation saved successfully"
    });
  };

  const runWorkflowHandler = (workflowId: string, options: any) => {
    return executeQuery(canvasState);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <CanvasHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClear={clearCanvas}
          onSave={() => setIsSaveDialogOpen(true)}
          onRun={() => executeQuery(canvasState)}
        />

        <CanvasError error={executionError} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="canvas" className="space-y-4">
            <div className="h-[500px]">
              <CanvasContent
                canvasState={canvasState}
                selectedOperator={selectedOperator}
                onSelectOperator={(operator) => selectOperator(operator?.id || null)}
                onUpdateOperator={updateOperator}
                onRemoveOperator={removeOperator}
                onConnect={connectOperators}
                onRemoveConnection={removeConnection}
                onDrop={handleDrop}
                onAddOperator={addOperator}
                getAvailableColumns={getAvailableColumns}
              />
            </div>

            <PreviewTabs
              activePreviewTab={activePreviewTab}
              setActivePreviewTab={setActivePreviewTab}
              generatedSql={generatedSql}
              previewResults={previewResults}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="saved-workflows">
            <SavedWorkflows
              onLoadWorkflow={loadCanvas}
              onRunWorkflow={runWorkflowHandler}
              onAutomationClick={handleAutomationClick}
              onDeleteWorkflow={() => {}}
            />
          </TabsContent>

          <TabsContent value="automation">
            <AutomationTab />
          </TabsContent>
        </Tabs>
      </div>

      <SaveWorkflowDialog
        open={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={(name: string, description: string) => 
          handleSaveWorkflow(saveCanvas, name, description)
        }
        isLoading={isSaving}
      />

      <RunWorkflowDialog
        open={isRunDialogOpen}
        onClose={() => setIsRunDialogOpen(false)}
        onRun={(options) => handleRunWorkflow(executeQuery, canvasState)}
        isLoading={isRunning}
      />

      <Sheet 
        open={isAutomationSheetOpen} 
        onOpenChange={setIsAutomationSheetOpen}
      >
        <SheetContent className="w-full sm:max-w-[900px] overflow-y-auto">
          <CreateAutomationCanvas 
            workflowId={selectedWorkflowId || ''} 
            onClose={() => setIsAutomationSheetOpen(false)} 
          />
        </SheetContent>
      </Sheet>

      {selectedWorkflow && (
        <AutomationDialog
          open={isAutomationOpen}
          onClose={() => setIsAutomationOpen(false)}
          onSave={handleSaveAutomation}
          workflowName={selectedWorkflow?.name || 'Workflow'}
        />
      )}
    </div>
  );
};

export default Canvas;
