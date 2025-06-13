
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Plus, ExternalLink, Edit, Trash2, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data sources
const sampleDataSources = [
  {
    id: 1,
    name: "Sales Database",
    type: "PostgreSQL",
    host: "db.example.com",
    status: "connected",
    lastSync: "2023-06-15T10:30:00",
    tables: 24,
  },
  {
    id: 2,
    name: "Marketing API",
    type: "REST API",
    host: "api.marketing.com",
    status: "connected",
    lastSync: "2023-06-14T16:45:00",
    tables: 8,
  },
  {
    id: 3,
    name: "Customer Data",
    type: "MySQL",
    host: "mysql.example.com",
    status: "error",
    lastSync: "2023-06-10T09:15:00",
    tables: 12,
  },
  {
    id: 4,
    name: "Analytics Data Lake",
    type: "Amazon S3",
    host: "s3://analytics-bucket",
    status: "connected",
    lastSync: "2023-06-13T11:20:00",
    tables: 56,
  },
  {
    id: 5,
    name: "Financial Reports",
    type: "CSV Files",
    host: "file://reports/",
    status: "idle",
    lastSync: "2023-06-01T14:10:00",
    tables: 6,
  },
];

interface DatabaseConnection {
  name: string;
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

interface ApiConnection {
  name: string;
  url: string;
  apiKey: string;
}

interface FileConnection {
  name: string;
  type: string;
  path: string;
}

const DataSources: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [databaseType, setDatabaseType] = useState("PostgreSQL");
  const [errors, setErrors] = useState<{
    database?: {[key: string]: string},
    api?: {[key: string]: string},
    files?: {[key: string]: string}
  }>({});

  const [databaseConnection, setDatabaseConnection] = useState<DatabaseConnection>({
    name: "",
    type: "PostgreSQL",
    host: "",
    port: "5432",
    username: "",
    password: "",
    database: ""
  });

  const [apiConnection, setApiConnection] = useState<ApiConnection>({
    name: "",
    url: "",
    apiKey: ""
  });

  const [fileConnection, setFileConnection] = useState<FileConnection>({
    name: "",
    type: "CSV",
    path: ""
  });

  const filteredDataSources = sampleDataSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "idle":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleRefreshSource = (id: number) => {
    toast({
      title: "Data source refreshed",
      description: `Data source #${id} has been refreshed successfully.`,
    });
  };

  const handleDatabaseInputChange = (field: keyof DatabaseConnection, value: string) => {
    setDatabaseConnection({
      ...databaseConnection,
      [field]: value
    });
    
    if (errors.database && errors.database[field]) {
      setErrors({
        ...errors,
        database: {
          ...errors.database,
          [field]: undefined
        }
      });
    }
  };

  const handleDatabaseTypeChange = (value: string) => {
    setDatabaseType(value);
    
    // Update default port based on database type
    let defaultPort = "5432"; // Default PostgreSQL port
    
    switch (value) {
      case "MySQL":
        defaultPort = "3306";
        break;
      case "MongoDB":
        defaultPort = "27017";
        break;
      case "SQLite":
        defaultPort = "";
        break;
      case "MSSQL":
        defaultPort = "1433";
        break;
      default:
        defaultPort = "5432";
    }
    
    setDatabaseConnection({
      ...databaseConnection,
      type: value,
      port: defaultPort
    });
  };

  const validateDatabaseForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!databaseConnection.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!databaseConnection.host.trim() && databaseType !== "SQLite") {
      newErrors.host = "Host is required";
    }
    
    if (!databaseConnection.username.trim() && databaseType !== "SQLite") {
      newErrors.username = "Username is required";
    }
    
    if (!databaseConnection.database.trim()) {
      newErrors.database = "Database name is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors({
        ...errors,
        database: newErrors
      });
      return false;
    }
    
    return true;
  };

  const validateApiForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!apiConnection.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!apiConnection.url.trim()) {
      newErrors.url = "URL is required";
    } else if (!apiConnection.url.startsWith("http://") && !apiConnection.url.startsWith("https://")) {
      newErrors.url = "URL must start with http:// or https://";
    }
    
    if (!apiConnection.apiKey.trim()) {
      newErrors.apiKey = "API Key is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors({
        ...errors,
        api: newErrors
      });
      return false;
    }
    
    return true;
  };

  const validateFileForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!fileConnection.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!fileConnection.path.trim()) {
      newErrors.path = "File path is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors({
        ...errors,
        files: newErrors
      });
      return false;
    }
    
    return true;
  };

  const handleAddDataSource = (tabValue: string) => {
    let isValid = false;
    
    switch (tabValue) {
      case "database":
        isValid = validateDatabaseForm();
        break;
      case "api":
        isValid = validateApiForm();
        break;
      case "files":
        isValid = validateFileForm();
        break;
    }
    
    if (isValid) {
      toast({
        title: "Data source added",
        description: "Your data source has been added successfully.",
      });
      
      // Reset forms
      setDatabaseConnection({
        name: "",
        type: "PostgreSQL",
        host: "",
        port: "5432",
        username: "",
        password: "",
        database: ""
      });
      
      setApiConnection({
        name: "",
        url: "",
        apiKey: ""
      });
      
      setFileConnection({
        name: "",
        type: "CSV",
        path: ""
      });
      
      setErrors({});
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Data Sources</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Data Source
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Data Source</DialogTitle>
              <DialogDescription>
                Connect to a database, API, or file storage.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="database">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              <TabsContent value="database" className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="database-type">Database Type</Label>
                    <Select
                      value={databaseType}
                      onValueChange={handleDatabaseTypeChange}
                    >
                      <SelectTrigger id="database-type">
                        <SelectValue placeholder="Select database type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                        <SelectItem value="MySQL">MySQL</SelectItem>
                        <SelectItem value="MongoDB">MongoDB (NoSQL)</SelectItem>
                        <SelectItem value="SQLite">SQLite</SelectItem>
                        <SelectItem value="MSSQL">Microsoft SQL Server</SelectItem>
                        <SelectItem value="Oracle">Oracle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={databaseConnection.name}
                      onChange={(e) => handleDatabaseInputChange("name", e.target.value)}
                      placeholder="My Database" 
                    />
                    {errors.database?.name && (
                      <p className="text-sm text-red-500">{errors.database.name}</p>
                    )}
                  </div>

                  {databaseType !== "SQLite" && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="host" className="text-right">
                          Host
                        </Label>
                        <Input 
                          id="host" 
                          className="col-span-3" 
                          placeholder="db.example.com"
                          value={databaseConnection.host}
                          onChange={(e) => handleDatabaseInputChange("host", e.target.value)}
                        />
                        {errors.database?.host && (
                          <div className="col-span-4 text-right">
                            <p className="text-sm text-red-500">{errors.database.host}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="port" className="text-right">
                          Port
                        </Label>
                        <Input 
                          id="port" 
                          className="col-span-3" 
                          value={databaseConnection.port}
                          onChange={(e) => handleDatabaseInputChange("port", e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {databaseType === "SQLite" ? (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="path" className="text-right">
                        File Path
                      </Label>
                      <Input 
                        id="path" 
                        className="col-span-3" 
                        placeholder="/path/to/database.sqlite"
                        value={databaseConnection.database}
                        onChange={(e) => handleDatabaseInputChange("database", e.target.value)}
                      />
                      {errors.database?.database && (
                        <div className="col-span-4 text-right">
                          <p className="text-sm text-red-500">{errors.database.database}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Username
                        </Label>
                        <Input 
                          id="username" 
                          className="col-span-3"
                          value={databaseConnection.username}
                          onChange={(e) => handleDatabaseInputChange("username", e.target.value)}
                        />
                        {errors.database?.username && (
                          <div className="col-span-4 text-right">
                            <p className="text-sm text-red-500">{errors.database.username}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Password
                        </Label>
                        <Input 
                          id="password" 
                          type="password" 
                          className="col-span-3"
                          value={databaseConnection.password}
                          onChange={(e) => handleDatabaseInputChange("password", e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="database" className="text-right">
                          Database
                        </Label>
                        <Input 
                          id="database" 
                          className="col-span-3"
                          value={databaseConnection.database}
                          onChange={(e) => handleDatabaseInputChange("database", e.target.value)}
                        />
                        {errors.database?.database && (
                          <div className="col-span-4 text-right">
                            <p className="text-sm text-red-500">{errors.database.database}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline">Test Connection</Button>
                  <Button onClick={() => handleAddDataSource("database")}>Add Data Source</Button>
                </DialogFooter>
              </TabsContent>
              
              <TabsContent value="api" className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-name">Name</Label>
                    <Input 
                      id="api-name" 
                      placeholder="My API"
                      value={apiConnection.name}
                      onChange={(e) => {
                        setApiConnection({ ...apiConnection, name: e.target.value });
                        if (errors.api?.name) {
                          setErrors({
                            ...errors,
                            api: { ...errors.api, name: undefined }
                          });
                        }
                      }}
                    />
                    {errors.api?.name && (
                      <p className="text-sm text-red-500">{errors.api.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-url">Base URL</Label>
                    <Input 
                      id="api-url" 
                      placeholder="https://api.example.com"
                      value={apiConnection.url}
                      onChange={(e) => {
                        setApiConnection({ ...apiConnection, url: e.target.value });
                        if (errors.api?.url) {
                          setErrors({
                            ...errors,
                            api: { ...errors.api, url: undefined }
                          });
                        }
                      }}
                    />
                    {errors.api?.url && (
                      <p className="text-sm text-red-500">{errors.api.url}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key" 
                      type="password"
                      value={apiConnection.apiKey}
                      onChange={(e) => {
                        setApiConnection({ ...apiConnection, apiKey: e.target.value });
                        if (errors.api?.apiKey) {
                          setErrors({
                            ...errors,
                            api: { ...errors.api, apiKey: undefined }
                          });
                        }
                      }}
                    />
                    {errors.api?.apiKey && (
                      <p className="text-sm text-red-500">{errors.api.apiKey}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Test Connection</Button>
                  <Button onClick={() => handleAddDataSource("api")}>Add API</Button>
                </DialogFooter>
              </TabsContent>
              
              <TabsContent value="files" className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-name">Name</Label>
                    <Input 
                      id="file-name" 
                      placeholder="My Files"
                      value={fileConnection.name}
                      onChange={(e) => {
                        setFileConnection({ ...fileConnection, name: e.target.value });
                        if (errors.files?.name) {
                          setErrors({
                            ...errors,
                            files: { ...errors.files, name: undefined }
                          });
                        }
                      }}
                    />
                    {errors.files?.name && (
                      <p className="text-sm text-red-500">{errors.files.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file-type">File Type</Label>
                    <Select
                      value={fileConnection.type}
                      onValueChange={(value) => setFileConnection({ ...fileConnection, type: value })}
                    >
                      <SelectTrigger id="file-type">
                        <SelectValue placeholder="Select file type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSV">CSV</SelectItem>
                        <SelectItem value="JSON">JSON</SelectItem>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="Parquet">Parquet</SelectItem>
                        <SelectItem value="XML">XML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file-path">File Path or URL</Label>
                    <Input 
                      id="file-path" 
                      placeholder="file:///path/to/files or s3://bucket/path"
                      value={fileConnection.path}
                      onChange={(e) => {
                        setFileConnection({ ...fileConnection, path: e.target.value });
                        if (errors.files?.path) {
                          setErrors({
                            ...errors,
                            files: { ...errors.files, path: undefined }
                          });
                        }
                      }}
                    />
                    {errors.files?.path && (
                      <p className="text-sm text-red-500">{errors.files.path}</p>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-50 rounded-full">
                        <Database className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Connection supports:</p>
                        <p className="text-muted-foreground">Local files, network shares, S3, Google Drive, Dropbox</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border border-dashed p-6 text-center cursor-pointer hover:bg-muted/50">
                    <input type="file" id="file-upload" className="hidden" multiple />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Plus className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Upload files directly</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Drop files here or click to browse
                      </p>
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Test Connection</Button>
                  <Button onClick={() => handleAddDataSource("files")}>Add Files</Button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search data sources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDataSources.map((source) => (
          <Card key={source.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{source.name}</CardTitle>
                  <CardDescription>{source.type}</CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(source.status)}`} />
                  <span className="text-xs capitalize">{source.status}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Host:</span>
                  <span className="font-mono">{source.host}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tables/Entities:</span>
                  <span>{source.tables}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Sync:</span>
                  <span>{new Date(source.lastSync).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Connect
                </Button>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRefreshSource(source.id)}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DataSources;
