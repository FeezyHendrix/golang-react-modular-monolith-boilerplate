
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useAppDataStore } from "@/hooks/useAppDataStore";
import WorkflowEditor from "./automation/WorkflowEditor";
import WorkflowNodesPalette from "./automation/WorkflowNodesPalette";
import NodeConfigPanel from "./automation/NodeConfigPanel";
import SaveWorkflowDialog from "./automation/SaveWorkflowDialog";
import WorkflowLibrary from "./automation/WorkflowLibrary";
import { Workflow, WorkflowNode, NodeType, NodeCategory } from "./automation/types";
import { useWorkflow } from "./automation/hooks/useWorkflow";
import DocumentationPanel from "./automation/DocumentationPanel";
import { Play, Save, List, FileText } from "lucide-react";

const AutomationBuilder = () => {
  const { toast } = useToast();
  const { dataSources } = useAppDataStore();
  const [activeTab, setActiveTab] = useState<string>("canvas");
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [showDocumentation, setShowDocumentation] = useState<boolean>(false);

  const {
    workflow,
    selectedNode,
    isRunning,
    selectNode,
    addNode,
    updateNode,
    removeNode,
    connectNodes,
    removeConnection,
    runWorkflow,
    runSingleNode,
    saveWorkflow,
    loadWorkflow,
    clearWorkflow,
  } = useWorkflow();

  const handleSaveWorkflow = (name: string, description?: string, tags?: string[]) => {
    saveWorkflow(name, description, tags);
    setShowSaveDialog(false);
    toast({
      title: "Workflow Saved",
      description: `Workflow "${name}" saved successfully`,
    });
  };

  const handleRunWorkflow = async () => {
    try {
      await runWorkflow();
      toast({
        title: "Success",
        description: "Workflow executed successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to execute workflow",
      });
    }
  };

  const handleDrop = (e: React.DragEvent, position: { x: number; y: number }) => {
    const nodeType = e.dataTransfer.getData("application/workflownode") as NodeType;
    const nodeCategory = e.dataTransfer.getData("application/nodecategory") as NodeCategory;
    
    if (nodeType) {
      addNode(nodeType, nodeCategory, position);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-end items-center mb-4">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowDocumentation(true)}
          >
            <FileText className="mr-2 h-4 w-4" /> How It Works
          </Button>
          <Button 
            variant="outline" 
            onClick={clearWorkflow}
          >
            Clear Canvas
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowSaveDialog(true)}
          >
            <Save className="mr-2 h-4 w-4" /> Save Workflow
          </Button>
          <Button 
            onClick={handleRunWorkflow} 
            disabled={isRunning || workflow.nodes.length === 0}
          >
            <Play className="mr-2 h-4 w-4" /> Run Workflow
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="canvas">Workflow Canvas</TabsTrigger>
          <TabsTrigger value="library">
            <List className="mr-2 h-4 w-4" /> My Workflows
          </TabsTrigger>
        </TabsList>

        <TabsContent value="canvas" className="flex-1 flex">
          <div className="w-64 border-r">
            <WorkflowNodesPalette onAddNode={addNode} />
          </div>
          
          <div className="flex-1 relative">
            <WorkflowEditor
              workflow={workflow}
              onSelectNode={selectNode}
              onUpdateNode={updateNode}
              onRemoveNode={removeNode}
              onConnect={connectNodes}
              onRemoveConnection={removeConnection}
              onDrop={handleDrop}
              isRunning={isRunning}
            />
          </div>
          
          {selectedNode && (
            <div className="w-80 border-l p-4">
              <NodeConfigPanel
                node={selectedNode}
                availableSources={workflow.nodes.filter(n => n.id !== selectedNode.id)}
                dataSources={dataSources}
                onUpdateNode={updateNode}
                onTestNode={runSingleNode}
                onClose={() => selectNode(null)}
                isRunning={isRunning}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="library" className="flex-1">
          <WorkflowLibrary onLoadWorkflow={loadWorkflow} />
        </TabsContent>
      </Tabs>

      {showSaveDialog && (
        <SaveWorkflowDialog
          open={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          onSave={handleSaveWorkflow}
        />
      )}

      <Sheet open={showDocumentation} onOpenChange={setShowDocumentation}>
        <SheetContent className="w-full md:max-w-[800px] sm:max-w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>How It Works: Automation & Orchestration</SheetTitle>
            <SheetDescription>
              Learn how to build and automate workflows using the various nodes and connections
            </SheetDescription>
          </SheetHeader>
          <DocumentationPanel />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AutomationBuilder;
