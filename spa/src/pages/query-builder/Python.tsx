
import React, { useState, useEffect } from "react";
import DataSourcePanel from "./components/DataSourcePanel";
import PythonEditor from "./components/PythonEditor";
import ResultsDisplay from "./components/ResultsDisplay";
import usePythonEditor from "./hooks/usePythonEditor";
import SaveQueryDialog from "./components/SaveQueryDialog";
import ExportDialog from "./components/ExportDialog";
import ConfirmationDialog from "./components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Play, Save, FileDown } from "lucide-react";
import { useQueryBuilder } from "./hooks/useQueryBuilder";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataSelection } from "../Decisioning/hooks/useDataSelection";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Python: React.FC = () => {
  const { toast } = useToast();
  const { pythonCode, setPythonCode, codeTemplates, addTemplate } = usePythonEditor();
  const { getAllSources } = useDataSelection();
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
    handleRunQuery,
    setSelectedQueryType
  } = useQueryBuilder();

  const [dataSources, setDataSources] = useState(getAllSources());
  const [selectedDataSource, setSelectedDataSource] = useState<string>("");
  const [hasResults, setHasResults] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [templateContent, setTemplateContent] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [chartImage, setChartImage] = useState<string>("");

  // Add the new templates
  useEffect(() => {
    // Add data transformation template if it doesn't exist
    if (!codeTemplates["dataTransformation"]) {
      addTemplate("dataTransformation", `import pandas as pd
import numpy as np

# Load and inspect the data
# df is assumed to be loaded from your selected data source

# Basic data inspection
print(df.head())
print(df.info())
print(df.describe())

# Handle missing values
df_clean = df.copy()
df_clean = df_clean.fillna({
    'numeric_column': df_clean['numeric_column'].median(),
    'categorical_column': 'Unknown'
})

# Feature engineering
df_clean['new_feature'] = df_clean['feature1'] / df_clean['feature2']
df_clean['binned_column'] = pd.cut(df_clean['numeric_column'], bins=5)

# One-hot encoding for categorical variables
categorical_cols = ['category', 'region']
df_encoded = pd.get_dummies(df_clean, columns=categorical_cols)

# Normalize numeric features
numeric_cols = ['revenue', 'profit', 'new_feature']
for col in numeric_cols:
    mean = df_clean[col].mean()
    std = df_clean[col].std()
    df_clean[f'{col}_normalized'] = (df_clean[col] - mean) / std

# Group by analysis
grouped = df_clean.groupby(['region', 'category']).agg({
    'revenue': ['sum', 'mean'],
    'profit': ['sum', 'mean'],
    'units_sold': ['sum', 'count']
}).reset_index()

# Return the transformed data
print("Transformation complete!")
transformed_data = df_clean.head(20)
print(transformed_data)

# Return the transformed dataframe
return transformed_data`);
    }
    
    // Add data visualization template if it doesn't exist
    if (!codeTemplates["dataVisualization"]) {
      addTemplate("dataVisualization", `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set styling for better visualizations
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 8)

# Assume df is loaded from your selected data source
# Basic data inspection
print(df.head())

# 1. Distribution plot for a numeric column
plt.figure(figsize=(12, 6))
sns.histplot(df['revenue'], kde=True)
plt.title('Distribution of Revenue')
plt.xlabel('Revenue')
plt.ylabel('Frequency')
plt.tight_layout()

# 2. Box plot for numeric values by category
plt.figure(figsize=(12, 6))
sns.boxplot(x='category', y='revenue', data=df)
plt.title('Revenue by Category')
plt.xticks(rotation=45)
plt.tight_layout()

# 3. Bar chart for categorical data
plt.figure(figsize=(12, 6))
category_counts = df['category'].value_counts()
sns.barplot(x=category_counts.index, y=category_counts.values)
plt.title('Count by Category')
plt.xlabel('Category')
plt.ylabel('Count')
plt.xticks(rotation=45)
plt.tight_layout()

# 4. Scatter plot with regression line
plt.figure(figsize=(12, 6))
sns.regplot(x='revenue', y='profit', data=df)
plt.title('Profit vs Revenue')
plt.tight_layout()

# 5. Correlation heatmap
plt.figure(figsize=(12, 10))
numeric_df = df.select_dtypes(include=[np.number])
correlation = numeric_df.corr()
sns.heatmap(correlation, annot=True, cmap='coolwarm', fmt='.2f')
plt.title('Correlation Heatmap')
plt.tight_layout()

# 6. Time series plot (if date column exists)
date_columns = [col for col in df.columns if 'date' in col.lower()]
if date_columns:
    date_col = date_columns[0]
    try:
        time_df = df.copy()
        time_df[date_col] = pd.to_datetime(time_df[date_col])
        time_df = time_df.set_index(date_col)
        time_df = time_df.resample('M')['revenue'].sum().reset_index()
        
        plt.figure(figsize=(12, 6))
        sns.lineplot(x=date_col, y='revenue', data=time_df)
        plt.title('Revenue Over Time')
        plt.xlabel('Date')
        plt.ylabel('Revenue')
        plt.tight_layout()
    except:
        print("Could not create time series plot")

# Return the last figure for display
plt.tight_layout()
return plt.gcf()`);
    }
  }, []);

  useEffect(() => {
    // Set default imports
    if (!pythonCode) {
      setPythonCode(`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt`);
    }
  }, []);

  useEffect(() => {
    if (selectedDataSource) {
      const selectedSource = dataSources.find(source => source.id.toString() === selectedDataSource);
      if (selectedSource) {
        // Add code to load the selected data source
        const dataLoadCode = `
# Load data from ${selectedSource.name}
df = pd.read_csv('data/${selectedSource.name.toLowerCase().replace(/\s+/g, '_')}.csv')

# Display the first 5 rows
print(df.head())

# Basic statistics
print(df.describe())
`;
        setPythonCode(`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt${dataLoadCode}`);
      }
    }
  }, [selectedDataSource]);

  const executeQuery = () => {
    // Simulate running the Python code
    setQueryResults([
      {id: 1, region: "West", product: "Laptop Pro", category: "Electronics", revenue: "$245,000", profit: "$73,500", units_sold: 2450},
      {id: 2, region: "East", product: "Phone X", category: "Electronics", revenue: "$189,500", profit: "$56,850", units_sold: 3790},
      {id: 3, region: "Central", product: "Smart Watch", category: "Electronics", revenue: "$97,200", profit: "$24,300", units_sold: 1620}
    ]);
    
    // Simulate console output
    setConsoleOutput(`Data shape: (1254, 10)

   date region product category  revenue   cost   profit  units_sold  customer_id salesperson
0  2023-01-15   West LaptopP Electronics  245000  171500   73500       2450           1      John
1  2023-01-20   West PhoneX  Electronics  189500  132650   56850       3790           2      Jane
2  2023-01-25   West SmartW  Electronics   97200   72900   24300       1620           3      Mike
...

Returning aggregated data with shape: (3, 6)`);

    // If the Python code contains matplotlib, simulate a chart output
    if (pythonCode.includes("plt.") || pythonCode.includes("plt.figure") || pythonCode.includes("sns.")) {
      setChartImage("/placeholder.svg");
    } else {
      setChartImage("");
    }
    
    handleRunQuery(pythonCode);
    setHasResults(true);
  };

  const handleSaveClick = () => {
    setSelectedQueryType("Python");
    setSaveDialogOpen(true);
  };

  const onSaveConfirm = () => {
    // Pass the actual results data instead of just the Python code
    if (handleSave({
      code: pythonCode,
      results: queryResults,
      consoleOutput,
      chartImage
    })) {
      // Navigate to query builder page on successful save
      // This would be handled by the hook itself
    }
  };
  
  const onExportConfirm = () => {
    // Use the actual results data
    handleExport(queryResults);
  };

  const showTemplate = (name: string, content: string) => {
    setTemplateContent(content);
    setTemplateName(name);
    setShowTemplateDialog(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(templateContent).then(() => {
      toast({
        title: "Template copied",
        description: "Template code copied to clipboard"
      });
      setShowTemplateDialog(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="w-64">
          <Select 
            value={selectedDataSource} 
            onValueChange={setSelectedDataSource}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select data source" />
            </SelectTrigger>
            <SelectContent>
              {dataSources.map((source) => (
                <SelectItem key={source.id} value={source.id.toString()}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSaveClick} variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button onClick={() => setExportDialogOpen(true)} variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={executeQuery}>
            <Play className="mr-2 h-4 w-4" />
            Run Query
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Side panel */}
        <DataSourcePanel 
          onTemplateSelect={(name) => showTemplate(name, codeTemplates[name])} 
          additionalTemplates={[
            { name: "dataTransformation", displayName: "Data Transformation Template" },
            { name: "dataVisualization", displayName: "Data Visualization Template (using matplotlib and seaborn)" }
          ]}
        />

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Code editor */}
          <PythonEditor 
            pythonCode={pythonCode} 
            setPythonCode={setPythonCode} 
          />

          {/* Results section */}
          <ResultsDisplay 
            visible={hasResults} 
            data={queryResults}
            consoleOutput={consoleOutput}
            chartImage={chartImage}
            hideGeneratedQuery={true}
          />
        </div>
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

      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{templateName} Template</DialogTitle>
            <DialogDescription>
              Copy this template to use in your Python script.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 p-4 bg-muted/30 rounded-md overflow-auto">
            <pre className="text-xs sm:text-sm whitespace-pre-wrap">{templateContent}</pre>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
            <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Python;
