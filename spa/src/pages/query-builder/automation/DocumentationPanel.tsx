
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { nodeDefinitions } from './nodeDefinitions';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const DocumentationPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  
  // Group nodes by category
  const nodeCategories = {
    trigger: {
      label: 'Triggers',
      description: 'Nodes that start a workflow when a specific event occurs',
      nodes: nodeDefinitions.filter(node => node.category === 'trigger')
    },
    action: {
      label: 'Actions',
      description: 'Nodes that perform actions like sending emails or saving data',
      nodes: nodeDefinitions.filter(node => node.category === 'action')
    },
    data: {
      label: 'Data Operators',
      description: 'Nodes that transform, filter, or manipulate data',
      nodes: nodeDefinitions.filter(node => node.category === 'data')
    },
    ai: {
      label: 'AI Operators',
      description: 'Nodes that use AI for analysis, generation, or insights',
      nodes: nodeDefinitions.filter(node => node.category === 'ai')
    },
    condition: {
      label: 'Conditions',
      description: 'Nodes that create branches in the workflow based on conditions',
      nodes: nodeDefinitions.filter(node => node.category === 'condition')
    },
    utility: {
      label: 'Utilities',
      description: 'Utility nodes for various workflow tasks',
      nodes: nodeDefinitions.filter(node => node.category === 'utility')
    }
  };
  
  const toggleNodeExpanded = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };
  
  // Filter nodes based on search term
  const filterNodes = (nodes: any[]) => {
    if (!searchTerm) return nodes;
    
    const searchLower = searchTerm.toLowerCase();
    return nodes.filter(node => 
      node.label.toLowerCase().includes(searchLower) ||
      node.description.toLowerCase().includes(searchLower) ||
      node.examples?.some((example: string) => 
        example.toLowerCase().includes(searchLower)
      )
    );
  };
  
  const renderNodesSection = (category: string, { label, description, nodes }: any) => {
    const filteredNodes = filterNodes(nodes);
    
    if (filteredNodes.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-1">{label}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="space-y-3">
          {filteredNodes.map(node => (
            <div 
              key={`${category}-${node.type}`}
              className="border rounded-md overflow-hidden"
            >
              <div 
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-accent"
                onClick={() => toggleNodeExpanded(`${category}-${node.type}`)}
              >
                <div className="font-medium">{node.label}</div>
                <div>
                  {expandedNodes[`${category}-${node.type}`] 
                    ? <ChevronUp className="h-4 w-4" /> 
                    : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
              
              {expandedNodes[`${category}-${node.type}`] && (
                <div className="p-3 border-t bg-accent/20">
                  <p className="text-sm mb-3">{node.description}</p>
                  
                  {node.configFields && node.configFields.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2">Configuration Options:</h4>
                      <ul className="text-xs space-y-1">
                        {node.configFields.map((field: any) => (
                          <li key={field.name} className="list-disc ml-4">
                            <span className="font-semibold">{field.label}</span>
                            {field.required && <span className="text-red-500">*</span>}
                            {field.hint && <span className="text-muted-foreground"> - {field.hint}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {node.examples && node.examples.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Examples:</h4>
                      <ul className="text-xs space-y-1">
                        {node.examples.map((example: string, i: number) => (
                          <li key={i} className="list-disc ml-4">{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4 p-3">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Tabs defaultValue="nodes">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nodes">Node Types</TabsTrigger>
          <TabsTrigger value="guides">Usage Guides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nodes" className="space-y-4 mt-4">
          {Object.entries(nodeCategories).map(([category, data]) => 
            renderNodesSection(category, data)
          )}
          
          {Object.values(nodeCategories).every(
            category => filterNodes(category.nodes).length === 0
          ) && (
            <div className="text-center p-6 border rounded-md">
              <p className="text-muted-foreground">
                No nodes match your search criteria
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="guides" className="mt-4">
          <div className="space-y-6">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Getting Started</h3>
              <p className="mb-3">
                Automation & Orchestration allows you to create powerful workflows that connect your data sources, 
                execute actions, and implement business logic without coding.
              </p>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Start with a <strong>Trigger</strong> node to define when your workflow should run</li>
                <li>Add <strong>Action</strong> nodes to perform tasks like sending emails or saving data</li>
                <li>Use <strong>Data Operators</strong> to filter, join, or transform your data</li>
                <li>Implement <strong>Conditions</strong> to create branching logic</li>
                <li>Connect nodes by dragging from one node's output handle to another node's input handle</li>
              </ol>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Common Workflow Patterns</h3>
              
              <div className="mb-4">
                <h4 className="text-md font-medium mb-1">Data Processing Pipeline</h4>
                <p className="text-sm">
                  Schedule → SQL Query → Filter Data → Export to CSV → Send Email
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Run a SQL query on a schedule, filter the results, export to CSV and email to stakeholders.
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-md font-medium mb-1">File Upload Processing</h4>
                <p className="text-sm">
                  File Upload → Data Cleaning → Save to Database → Notification
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Process uploaded files, clean the data, save to database and send notification when complete.
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-md font-medium mb-1">Conditional Alerting</h4>
                <p className="text-sm">
                  Data Update → If Condition → (True: Send Alert, False: Log Only)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitor data sources and send alerts only when specific conditions are met.
                </p>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-1">AI-Enhanced Workflow</h4>
                <p className="text-sm">
                  Schedule → Database → Analyze Text → Generate Report → Export to PDF
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use AI to analyze data and generate reports automatically on a schedule.
                </p>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Best Practices</h3>
              <ul className="list-disc ml-5 space-y-2 text-sm">
                <li><strong>Name your workflows</strong> descriptively so they're easy to identify later</li>
                <li><strong>Test nodes individually</strong> before running the entire workflow</li>
                <li>Use the <strong>If Condition</strong> node to create branching logic</li>
                <li>Add <strong>error handling</strong> paths for critical workflows</li>
                <li>Use <strong>tags</strong> to organize your workflows by purpose or department</li>
                <li>Consider adding <strong>delay nodes</strong> between API calls to avoid rate limiting</li>
                <li>Use <strong>AI operators</strong> to enhance your data with insights and summaries</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentationPanel;
