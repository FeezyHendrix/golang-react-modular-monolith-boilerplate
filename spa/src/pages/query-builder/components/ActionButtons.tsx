
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Save, FileDown } from "lucide-react";
import SaveQueryDialog from "./SaveQueryDialog";
import ExportDialog from "./ExportDialog";
import { useQueryBuilder } from "../hooks/useQueryBuilder";

interface ActionButtonsProps {
  onRunQuery: () => void;
  content: string;
  queryType: 'SQL' | 'Python' | 'Table Joins' | 'Transformations';
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onRunQuery, 
  content,
  queryType
}) => {
  const {
    saveDialogOpen,
    setSaveDialogOpen,
    exportDialogOpen,
    setExportDialogOpen,
    saveDetails,
    setSaveDetails,
    exportName,
    setExportName,
    handleSave,
    handleExport,
    setSelectedQueryType
  } = useQueryBuilder();

  const handleSaveClick = () => {
    setSelectedQueryType(queryType);
    setSaveDialogOpen(true);
  };

  const onSaveConfirm = () => {
    handleSave(content);
  };

  const onExportConfirm = () => {
    handleExport();
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button onClick={handleSaveClick} variant="outline">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button onClick={() => setExportDialogOpen(true)} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button onClick={onRunQuery}>
          <Play className="mr-2 h-4 w-4" />
          Run Query
        </Button>
      </div>

      <SaveQueryDialog
        open={saveDialogOpen}
        setOpen={setSaveDialogOpen}
        title={saveDetails.title}
        setTitle={(title) => setSaveDetails({ ...saveDetails, title })}
        description={saveDetails.description}
        setDescription={(description) => setSaveDetails({ ...saveDetails, description })}
        onSave={onSaveConfirm}
      />

      <ExportDialog
        open={exportDialogOpen}
        setOpen={setExportDialogOpen}
        fileName={exportName}
        setFileName={setExportName}
        onExport={onExportConfirm}
      />
    </>
  );
};

export default ActionButtons;
