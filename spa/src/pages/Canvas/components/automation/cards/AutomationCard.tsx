
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AutomationCardProps {
  title: string;
  type: 'trigger' | 'action' | 'condition' | 'utility';
  onApply: () => void;
  children?: React.ReactNode;
}

export const AutomationCard: React.FC<AutomationCardProps> = ({
  title,
  type,
  onApply,
  children
}) => {
  // Map types to color classes
  const getButtonColorClass = () => {
    switch (type) {
      case 'trigger':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'action':
        return 'bg-green-600 hover:bg-green-700';
      case 'condition':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'utility':
        return 'bg-purple-600 hover:bg-purple-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <div className="mt-4">
          <Button 
            className={`w-full ${getButtonColorClass()}`}
            onClick={onApply}
          >
            Apply {title}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
