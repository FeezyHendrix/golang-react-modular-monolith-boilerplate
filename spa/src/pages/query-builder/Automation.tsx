
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus,
  PlayCircle,
  Settings,
  Database,
  Code2
} from "lucide-react";

const QueryBuilder = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Query Builder</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Query
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium">Daily Data Sync</h3>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Syncs data from multiple sources daily at 2 AM
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center">
              <Database className="w-4 h-4 mr-2 text-green-500" />
              <span className="text-sm text-muted-foreground">3 Sources</span>
            </div>
            <Button variant="secondary" size="sm">
              <PlayCircle className="w-4 h-4 mr-2" />
              Run Now
            </Button>
          </div>
        </Card>

        {/* Example of an automation in progress */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-purple-500" />
              <h3 className="font-medium">Weekly Report</h3>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Generates and emails weekly performance reports
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center">
              <Database className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm text-muted-foreground">2 Sources</span>
            </div>
            <div className="flex items-center text-sm text-orange-500">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Running...
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QueryBuilder;
