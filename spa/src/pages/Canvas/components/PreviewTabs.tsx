
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SqlPreview from './SqlPreview';
import PreviewResults from './PreviewResults';

interface PreviewTabsProps {
  activePreviewTab: string;
  setActivePreviewTab: (value: string) => void;
  generatedSql: string;
  previewResults: any;
  isLoading: boolean;
}

const PreviewTabs: React.FC<PreviewTabsProps> = ({
  activePreviewTab,
  setActivePreviewTab,
  generatedSql,
  previewResults,
  isLoading
}) => {
  return (
    <div className="border rounded-lg flex flex-col h-full">
      <Tabs value={activePreviewTab} onValueChange={setActivePreviewTab} className="w-full flex flex-col flex-grow">
        <div className="border-b px-4 pt-2">
          <TabsList className="bg-transparent p-0 border-b-0">
            <TabsTrigger value="results-preview" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Results Preview
            </TabsTrigger>
            <TabsTrigger value="sql-preview" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              SQL Preview
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-4 flex-grow overflow-auto">
          <TabsContent value="results-preview" className="mt-0 h-full overflow-auto">
            <PreviewResults data={previewResults} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="sql-preview" className="mt-0 h-full overflow-auto">
            <SqlPreview sql={generatedSql} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PreviewTabs;
