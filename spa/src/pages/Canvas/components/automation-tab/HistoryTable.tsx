
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface HistoryTableProps {
  history: any[];
  formatDate: (dateString?: string) => string;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history, formatDate }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Automation Execution History</h3>
      
      {history.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left">Automation</th>
                <th className="px-4 py-2 text-left">Trigger Type</th>
                <th className="px-4 py-2 text-left">Timestamp</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id} className="border-t">
                  <td className="px-4 py-2">{entry.automationName}</td>
                  <td className="px-4 py-2">
                    {entry.triggerType === 'manual' ? 'Manual Run' : entry.triggerType}
                  </td>
                  <td className="px-4 py-2">{formatDate(entry.timestamp)}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      {entry.status === 'success' ? (
                        <><CheckCircle className="h-4 w-4 text-green-500" /> Success</>
                      ) : (
                        <><AlertCircle className="h-4 w-4 text-red-500" /> Failed</>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md">
          <h3 className="text-lg font-medium mb-2">No execution history</h3>
          <p className="text-muted-foreground">
            No automations have been executed yet
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
