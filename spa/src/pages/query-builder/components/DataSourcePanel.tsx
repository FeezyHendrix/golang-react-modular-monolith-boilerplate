
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, LayoutList, ArrowRightLeft, FileSpreadsheet, Database, PieChart } from "lucide-react";

interface TemplateOption {
  name: string;
  displayName: string;
  icon?: React.ReactNode;
}

interface DataSourcePanelProps {
  onTemplateSelect: (templateName: string) => void;
  additionalTemplates?: TemplateOption[];
}

const DataSourcePanel: React.FC<DataSourcePanelProps> = ({ 
  onTemplateSelect,
  additionalTemplates = []
}) => {
  const defaultTemplates = [
    {
      name: "basicAnalysis",
      displayName: "Basic Data Analysis",
      icon: <LayoutList className="mr-2 h-4 w-4" />
    },
    {
      name: "dataCleaning",
      displayName: "Data Cleaning",
      icon: <ArrowRightLeft className="mr-2 h-4 w-4" />
    },
    {
      name: "timeSeries",
      displayName: "Time Series Analysis",
      icon: <FileSpreadsheet className="mr-2 h-4 w-4" />
    }
  ];
  
  const getIconForTemplate = (templateName: string) => {
    switch (templateName) {
      case "dataTransformation":
        return <ArrowRightLeft className="mr-2 h-4 w-4" />;
      case "dataVisualization":
        return <PieChart className="mr-2 h-4 w-4" />;
      default:
        return <FileSpreadsheet className="mr-2 h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Code2 className="mr-2 h-4 w-4" />
            Common Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {defaultTemplates.map((template) => (
            <Button 
              key={template.name}
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => onTemplateSelect(template.name)}
            >
              {template.icon}
              {template.displayName}
            </Button>
          ))}
          
          {/* Additional templates */}
          {additionalTemplates.map((template) => (
            <Button 
              key={template.name}
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onTemplateSelect(template.name)}
            >
              {template.icon || getIconForTemplate(template.name)}
              {template.displayName}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSourcePanel;
