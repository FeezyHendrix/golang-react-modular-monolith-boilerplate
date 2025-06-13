
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Search, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReportActionDialog from "@/components/reports/ReportActionDialog";
import { Insight } from "@/pages/Decisioning/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Reports: React.FC = () => {
  // State for handling the dialogs
  const [selectedReport, setSelectedReport] = useState<{
    id: number;
    title: string;
    type: 'decision' | 'insight';
  } | null>(null);
  
  // Sample insights - would come from an API in a real app
  const insights: Insight[] = [
    { id: 1, title: "Sales Growth Opportunity", description: "Product line X shows 32% growth potential in the Northwest region.", category: "Sales", priority: "High" },
    { id: 2, title: "Cost Reduction", description: "Optimizing supplier contracts could reduce COGS by 8%.", category: "Finance", priority: "Medium" },
    { id: 3, title: "Customer Retention Risk", description: "Enterprise segment showing increased churn indicators.", category: "Customer", priority: "High" },
    { id: 4, title: "Inventory Excess", description: "Warehouse B showing 22% excess inventory for SKUs 1001-1042.", category: "Operations", priority: "Medium" },
    { id: 5, title: "Marketing Campaign Effectiveness", description: "Email campaigns outperforming social media by 3.5x ROI.", category: "Marketing", priority: "Low" },
    { id: 6, title: "Customer Retention Strategy", description: "Analysis indicates a 15% churn risk in enterprise segment. Recommended actions include targeted outreach and loyalty program adjustments.", category: "Customer", priority: "Medium" },
  ];

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Filter logic
  const filteredInsights = insights.filter(insight => {
    // Search query filter
    const matchesSearch = searchQuery === "" || 
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "" || insight.category === categoryFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === "" || insight.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Handle adding a filter
  const addFilter = (type: string, value: string) => {
    if (type === 'category') {
      setCategoryFilter(value);
      setActiveFilters([...activeFilters.filter(f => !f.startsWith('Category:')), `Category: ${value}`]);
    } else if (type === 'priority') {
      setPriorityFilter(value);
      setActiveFilters([...activeFilters.filter(f => !f.startsWith('Priority:')), `Priority: ${value}`]);
    }
  };

  // Handle removing a filter
  const removeFilter = (filter: string) => {
    if (filter.startsWith('Category:')) {
      setCategoryFilter("");
    } else if (filter.startsWith('Priority:')) {
      setPriorityFilter("");
    }
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setPriorityFilter("");
    setActiveFilters([]);
  };

  const handleViewInsight = (insight: Insight) => {
    setSelectedReport({
      id: insight.id,
      title: insight.title,
      type: 'insight'
    });
  };

  // Get unique categories and priorities for filter options
  const categories = Array.from(new Set(insights.map(insight => insight.category)));
  const priorities = Array.from(new Set(insights.map(insight => insight.priority)));

  return (
    <div className="space-y-8">
      {/* Top AI Insights Section with improved search and filtering */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Top AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search insights..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Category
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map(category => (
                    <DropdownMenuItem key={category} onClick={() => addFilter('category', category)}>
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Priority
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Select Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {priorities.map(priority => (
                    <DropdownMenuItem key={priority} onClick={() => addFilter('priority', priority)}>
                      {priority}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex gap-2 mb-4 items-center flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {activeFilters.map(filter => (
                <Badge key={filter} variant="outline" className="flex items-center gap-1 py-1">
                  {filter}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1" 
                    onClick={() => removeFilter(filter)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button variant="link" size="sm" className="text-xs" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Insight</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInsights.length > 0 ? (
                filteredInsights.map((insight) => (
                  <TableRow key={insight.id}>
                    <TableCell className="font-medium">{insight.title}</TableCell>
                    <TableCell className="max-w-md truncate">{insight.description}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        insight.category === "Sales" ? "bg-blue-100 text-blue-800" : 
                        insight.category === "Finance" ? "bg-green-100 text-green-800" : 
                        insight.category === "Customer" ? "bg-purple-100 text-purple-800" :
                        insight.category === "Operations" ? "bg-orange-100 text-orange-800" :
                        "bg-pink-100 text-pink-800"
                      }`}>
                        {insight.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        insight.priority === "High" ? "bg-red-100 text-red-800" : 
                        insight.priority === "Medium" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-green-100 text-green-800"
                      }`}>
                        {insight.priority}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewInsight(insight)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No insights found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Action Dialog */}
      {selectedReport && (
        <ReportActionDialog
          open={selectedReport !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedReport(null);
          }}
          reportTitle={selectedReport.title}
          reportId={selectedReport.id}
          reportType={selectedReport.type}
        />
      )}
    </div>
  );
};

export default Reports;
