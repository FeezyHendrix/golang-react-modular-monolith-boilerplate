
import React, { useState, useCallback, useMemo } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { OperatorData, OperatorStatus, OperatorType } from '../types';
import ConfigPanelContent from './config-panel/ConfigPanelContent';
import ConfigPanelDialogContent from './config-panel/ConfigPanelDialogContent';

// Import all the configs
import SourceConfig from './config/SourceConfig';
import FilterConfig from './config/FilterConfig';
import JoinConfig from './config/JoinConfig';
import AggregateConfig from './config/AggregateConfig';
import SelectConfig from './config/SelectConfig';
import UnionConfig from './config/UnionConfig';
import SortConfig from './config/SortConfig';
import LimitConfig from './config/LimitConfig';
import AnalyzeTextConfig from './config/AnalyzeTextConfig';

interface ConfigPanelProps {
  operator: OperatorData;
  updateOperator: (operator: OperatorData) => void;
  onClose: () => void;
  connectedOperators?: OperatorData[];
  getAvailableColumns?: (operatorId: string) => string[];
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  operator,
  updateOperator,
  onClose,
  connectedOperators = [],
  getAvailableColumns = () => []
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPoppedOut, setIsPoppedOut] = useState(false);
  const { toast } = useToast();

  // Used to track if configure specific components handle their own save
  const [componentHandlesSave, setComponentHandlesSave] = useState(false);

  const togglePopOut = useCallback(() => {
    setIsPoppedOut(prev => !prev);
  }, []);

  const handleSaveConfiguration = useCallback(async () => {
    if (componentHandlesSave) return;
    
    setIsLoading(true);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 20;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedOperator = {
      ...operator,
      status: OperatorStatus.CONFIGURED
    };
    
    updateOperator(updatedOperator);
    setIsLoading(false);
    clearInterval(progressInterval);
    setProgress(100);
    
    let operatorTypeLabel = operator.type.charAt(0).toUpperCase() + operator.type.slice(1);
    
    // Add a special message for analyze text operator
    if (operator.type === OperatorType.ANALYZE) {
      const analyzeOperator = operator as any;
      const analysisType = analyzeOperator.analysisType;
      const textField = analyzeOperator.textField;
      if (analysisType && textField) {
        operatorTypeLabel = `${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis on '${textField}'`;
      }
    }
    
    toast({
      title: "Configuration saved",
      description: `${operatorTypeLabel} configured successfully.`
    });
  }, [componentHandlesSave, operator, updateOperator, toast]);

  // For operators that manage their own save state
  React.useEffect(() => {
    setComponentHandlesSave(operator.type === OperatorType.SOURCE);
  }, [operator.type]);

  const configTitle = useMemo(() => `Configure ${operator.type}`, [operator.type]);

  if (isPoppedOut) {
    return (
      <Dialog open={true} onOpenChange={() => setIsPoppedOut(false)}>
        <ConfigPanelDialogContent
          title={configTitle}
          onClose={() => setIsPoppedOut(false)}
          isLoading={isLoading}
          progress={progress}
        >
          <div className="space-y-4">
            <ConfigPanelContent 
              operator={operator}
              updateOperator={updateOperator}
              onClose={() => setIsPoppedOut(false)}
              connectedOperators={connectedOperators}
              getAvailableColumns={getAvailableColumns}
              isLoading={isLoading}
              progress={progress}
              onSave={handleSaveConfiguration}
              componentHandlesSave={componentHandlesSave}
              isPoppedOut={true}
              onTogglePop={togglePopOut}
            />
          </div>
        </ConfigPanelDialogContent>
      </Dialog>
    );
  }

  return (
    <div className="w-72 border-l h-full bg-card">
      <ConfigPanelContent
        operator={operator}
        updateOperator={updateOperator}
        onClose={onClose}
        connectedOperators={connectedOperators}
        getAvailableColumns={getAvailableColumns}
        isLoading={isLoading}
        progress={progress}
        onSave={handleSaveConfiguration}
        componentHandlesSave={componentHandlesSave}
        isPoppedOut={isPoppedOut}
        onTogglePop={togglePopOut}
      />
    </div>
  );
};

export default ConfigPanel;
