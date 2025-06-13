
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define types
export type DataSourceType = "Database" | "File" | "API" | "Document" | string;

export interface DataSource {
  id: number;
  name: string;
  type: DataSourceType;
}

export interface QueryResult {
  id: string;
  title: string;
  type: "SQL" | "Python" | "Canvas";
  date: string;
  description?: string;
}

export interface Insight {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  date?: string;
}

// Compose the store context
interface AppDataStoreContextType {
  dataSources: DataSource[];
  setDataSources: React.Dispatch<React.SetStateAction<DataSource[]>>;
  queries: QueryResult[];
  setQueries: React.Dispatch<React.SetStateAction<QueryResult[]>>;
  insights: Insight[];
  setInsights: React.Dispatch<React.SetStateAction<Insight[]>>;
}

const AppDataStoreContext = createContext<AppDataStoreContextType | undefined>(undefined);

export const AppDataStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mock hydrated data; in production, fetch from API/db or persisted state.
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { id: 1, name: "Customers DB", type: "Database" },
    { id: 2, name: "Orders DB", type: "Database" },
    { id: 3, name: "Sales Data", type: "File" },
    { id: 4, name: "Marketing Reports", type: "Document" },
    { id: 5, name: "Product Catalog", type: "File" }
  ]);

  const [queries, setQueries] = useState<QueryResult[]>([
    // Preloaded for demo; this should be hydrated from Query Builder saves
    { id: "a", title: "Sales Report", type: "SQL", date: "2025-04-05T08:21:00Z", description: "Monthly sales summary" },
    { id: "b", title: "Customer Analysis", type: "Python", date: "2025-04-05T08:28:00Z", description: "Customer segmentation" },
    { id: "c", title: "Inventory", type: "SQL", date: "2025-04-05T08:43:00Z", description: "Current inventory levels" },
    { id: "d", title: "Marketing", type: "Canvas", date: "2025-04-05T08:50:00Z", description: "Campaign performance" }
  ]);

  const [insights, setInsights] = useState<Insight[]>([
    { id: 1, title: "Sales Growth Opportunity", description: "Product line X shows 32% growth potential in the Northwest region.", category: "Sales", priority: "High", date: "2025-04-21T10:05:00Z" },
    { id: 2, title: "Cost Reduction", description: "Optimizing supplier contracts could reduce COGS by 8%.", category: "Finance", priority: "Medium", date: "2025-04-20T08:30:00Z" },
    { id: 3, title: "Customer Retention Risk", description: "Enterprise segment showing increased churn indicators.", category: "Customer", priority: "High", date: "2025-04-20T06:20:00Z" },
    { id: 4, title: "Inventory Excess", description: "Warehouse B showing 22% excess inventory for SKUs 1001-1042.", category: "Operations", priority: "Medium", date: "2025-04-17T11:40:00Z" },
    { id: 5, title: "Marketing Campaign Effectiveness", description: "Email campaigns outperforming social media by 3.5x ROI.", category: "Marketing", priority: "Low", date: "2025-04-16T15:15:00Z" },
  ]);

  // Optionally: hydrate from localStorage/api here

  return (
    <AppDataStoreContext.Provider
      value={{ dataSources, setDataSources, queries, setQueries, insights, setInsights }}
    >
      {children}
    </AppDataStoreContext.Provider>
  );
};

// Hook for consumption
export function useAppDataStore() {
  const context = useContext(AppDataStoreContext);
  if (!context) {
    throw new Error("useAppDataStore must be used within AppDataStoreProvider");
  }
  return context;
}
