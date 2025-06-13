
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResultsDisplayProps {
  visible?: boolean;
  data?: any[];
  consoleOutput?: string;
  chartImage?: string;
  hideGeneratedQuery?: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  visible = true, 
  data = [],
  consoleOutput = "",
  chartImage = "",
  hideGeneratedQuery = false
}) => {
  if (!visible) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Run your query to see results
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get column headers from the first data item if available
  const columns = data && data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'id') 
    : [];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="table">
          <TabsList className="px-4">
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="console">Console Output</TabsTrigger>
            {chartImage && <TabsTrigger value="chart">Chart</TabsTrigger>}
            {!hideGeneratedQuery && <TabsTrigger value="query">Generated Query</TabsTrigger>}
          </TabsList>
          <TabsContent value="table" className="p-2 m-0">
            <div className="border rounded overflow-hidden">
              <ScrollArea className="h-60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell key={`${index}-${column}`}>{row[column]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="console" className="p-2 m-0">
            <ScrollArea className="h-60 border rounded-md">
              <div className="bg-muted/30 p-3 font-mono text-sm">
                {consoleOutput ? (
                  consoleOutput.split('\n').map((line, i) => (
                    <div key={i} className="text-muted-foreground">{line}</div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No console output available</div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          {chartImage && (
            <TabsContent value="chart" className="p-2 m-0">
              <div className="bg-background border rounded-md p-3 h-60 flex items-center justify-center">
                {chartImage ? (
                  <img src={chartImage} alt="Chart" className="max-h-full" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>No chart visualization available</p>
                    <p className="text-xs mt-2">Use plt.figure() in your code to generate charts</p>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
          {!hideGeneratedQuery && (
            <TabsContent value="query" className="p-2 m-0">
              <ScrollArea className="h-60 border rounded-md">
                <div className="bg-muted/30 p-3 font-mono text-sm">
                  <pre className="text-muted-foreground">
{`SELECT 
  region, 
  category, 
  SUM(revenue) as revenue, 
  SUM(profit) as profit, 
  SUM(units_sold) as units_sold, 
  (SUM(profit) / SUM(revenue)) * 100 as margin_percent
FROM 
  sales_data
GROUP BY 
  region, category
ORDER BY 
  revenue DESC
LIMIT 100`}
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
