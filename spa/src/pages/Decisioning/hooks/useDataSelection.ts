
import { useState } from "react";
import { DataItem, Document } from "../types";

export type DataSource = {
  id: number;
  name: string;
  type: string;
  location?: string;
  selected: boolean;
};

export type SavedQuery = {
  id: number;
  name: string;
  type: string;
  location?: string;
  selected: boolean;
};

export const useDataSelection = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { id: 1, name: "Customers DB", type: "Database", location: "SQL Server", selected: false },
    { id: 2, name: "Orders DB", type: "Database", location: "MySQL", selected: false },
    { id: 3, name: "Sales Data", type: "File", location: "/path/to/sales.csv", selected: false },
    { id: 4, name: "Marketing Reports", type: "Document", location: "/path/to/reports.pdf", selected: false },
    { id: 5, name: "Product Catalog", type: "File", location: "/path/to/catalog.xlsx", selected: false }
  ]);
  
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([
    { id: 6, name: "Customer Segmentation", type: "SQL", selected: false },
    { id: 7, name: "Sales Trend Analysis", type: "Python", selected: false }
  ]);
  
  const [documents, setDocuments] = useState<Document[]>([
    { id: 8, name: "Privacy Policy", type: "docx", location: "/path/to/privacy.docx", selected: false },
    { id: 9, name: "Terms of Service", type: "pdf", location: "/path/to/tos.pdf", selected: false }
  ]);
  
  const hasAnyItemSelected = () => {
    return (
      dataSources.some(source => source.selected) ||
      savedQueries.some(query => query.selected) ||
      documents.some(doc => doc.selected)
    );
  };
  
  const getDatabaseSources = () => {
    return dataSources.filter(source => source.type === "Database");
  };
  
  const getFileSources = () => {
    return dataSources.filter(source => source.type === "File");
  };
  
  const getAllSources = () => {
    return dataSources;
  };

  return {
    dataSources,
    setDataSources,
    savedQueries,
    setSavedQueries,
    documents,
    setDocuments,
    hasAnyItemSelected,
    getDatabaseSources,
    getFileSources,
    getAllSources
  };
};
