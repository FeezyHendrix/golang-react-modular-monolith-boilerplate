
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { nodeDefinitions } from './nodeDefinitions';
import { NodeType, NodeCategory, Position } from './types';
import { 
  FileUp, Clock, DatabaseZap, Mail, Bell, Database,
  FileDown, Search, Code, Filter, GitMerge, Play 
} from 'lucide-react';

interface WorkflowNodesPaletteProps {
  onAddNode: (type: NodeType, category: NodeCategory, position: Position) => void;
}

// Group nodes by category
const getNodesByCategory = () => {
  const categories = {
    trigger: { label: 'Triggers', nodes: [] as any[] },
    action: { label: 'Actions', nodes: [] as any[] },
    data: { label: 'Data Operators', nodes: [] as any[] },
    ai: { label: 'AI Operators', nodes: [] as any[] },
    condition: { label: 'Conditions', nodes: [] as any[] },
    utility: { label: 'Utilities', nodes: [] as any[] },
  };
  
  nodeDefinitions.forEach(node => {
    if (categories[node.category]) {
      categories[node.category].nodes.push(node);
    }
  });
  
  return Object.entries(categories);
};

// Get icon component by name
const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    'file-up': <FileUp className="h-4 w-4" />,
    'clock': <Clock className="h-4 w-4" />,
    'database-zap': <DatabaseZap className="h-4 w-4" />,
    'mail': <Mail className="h-4 w-4" />,
    'bell': <Bell className="h-4 w-4" />,
    'database': <Database className="h-4 w-4" />,
    'file-down': <FileDown className="h-4 w-4" />,
    'search': <Search className="h-4 w-4" />,
    'code': <Code className="h-4 w-4" />,
    'filter': <Filter className="h-4 w-4" />,
    'join': <GitMerge className="h-4 w-4" />, // Changed from Join to GitMerge
    'play': <Play className="h-4 w-4" />
  };
  
  return icons[iconName] || <div className="h-4 w-4" />;
};

const WorkflowNodesPalette: React.FC<WorkflowNodesPaletteProps> = ({ onAddNode }) => {
  const nodeCategories = getNodesByCategory();
  
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    nodeType: NodeType,
    nodeCategory: NodeCategory
  ) => {
    e.dataTransfer.setData('application/workflownode', nodeType);
    e.dataTransfer.setData('application/nodecategory', nodeCategory);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  return (
    <div className="p-4 overflow-y-auto h-full">
      <h3 className="text-lg font-medium mb-4">Workflow Nodes</h3>
      <Accordion type="multiple" defaultValue={['trigger']}>
        {nodeCategories.map(([category, { label, nodes }]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="text-sm font-medium py-2">
              {label}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {nodes.map((node) => (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.type, node.category)}
                    className="flex items-center p-2 rounded-md bg-background hover:bg-accent cursor-move border border-border"
                  >
                    <div className="mr-2 text-primary">
                      {getIconComponent(node.icon)}
                    </div>
                    <span className="text-sm">{node.label}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default WorkflowNodesPalette;
