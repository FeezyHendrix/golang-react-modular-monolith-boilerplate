
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Share, RefreshCw } from "lucide-react";

type DecisioningHeaderProps = {
  handleSave: () => void;
  handleShare: () => void;
  handleRefresh: () => void;
};

const DecisioningHeader: React.FC<DecisioningHeaderProps> = ({
  handleSave,
  handleShare,
  handleRefresh,
}) => {
  return (
    <div className="p-4 border-b border-border flex justify-end items-center">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleSave}>
          <Save size={16} className="mr-1" /> Save
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share size={16} className="mr-1" /> Share
        </Button>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw size={16} className="mr-1" /> Refresh
        </Button>
      </div>
    </div>
  );
};

export default DecisioningHeader;
