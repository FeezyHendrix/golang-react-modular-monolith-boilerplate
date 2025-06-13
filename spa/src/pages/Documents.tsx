import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText, Search, Upload, Filter, Plus, Calendar, Tag, User, 
  MoreHorizontal, Eye, Download, Trash, ArrowUpDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Document = {
  id: string;
  name: string;
  type: string;
  status: "Processed" | "Processing" | "Failed";
  size: string;
  tags: string[];
  uploadedBy: string;
  uploadedDate: string;
};

const Documents: React.FC = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc1",
      name: "Q4 Financial Report.pdf",
      type: "PDF",
      status: "Processed",
      size: "2.4 MB",
      tags: ["Finance", "Quarterly"],
      uploadedBy: "Jane Smith",
      uploadedDate: "2025-03-15",
    },
    {
      id: "doc2",
      name: "Customer Segmentation Analysis.xlsx",
      type: "Excel",
      status: "Processed",
      size: "1.8 MB",
      tags: ["Marketing", "Analysis"],
      uploadedBy: "John Doe",
      uploadedDate: "2025-03-10",
    },
    {
      id: "doc3",
      name: "Supply Chain Optimization.pptx",
      type: "PowerPoint",
      status: "Processed",
      size: "5.2 MB",
      tags: ["Operations", "Strategy"],
      uploadedBy: "Alex Johnson",
      uploadedDate: "2025-03-05",
    },
    {
      id: "doc4",
      name: "Product Roadmap 2025.docx",
      type: "Word",
      status: "Processing",
      size: "1.1 MB",
      tags: ["Product", "Planning"],
      uploadedBy: "Sarah Williams",
      uploadedDate: "2025-04-01",
    },
    {
      id: "doc5",
      name: "Market Research Data.csv",
      type: "CSV",
      status: "Processed",
      size: "3.7 MB",
      tags: ["Marketing", "Research"],
      uploadedBy: "Mike Brown",
      uploadedDate: "2025-03-25",
    }
  ]);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTags, setUploadTags] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!uploadFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    const tagsList = uploadTags.split(",").map(tag => tag.trim()).filter(tag => tag);
    const newDoc: Document = {
      id: `doc${documents.length + 1}`,
      name: uploadFile.name,
      type: uploadFile.name.split('.').pop()?.toUpperCase() || "Unknown",
      status: "Processing",
      size: `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`,
      tags: tagsList,
      uploadedBy: "Current User",
      uploadedDate: new Date().toISOString().split('T')[0],
    };

    setDocuments([newDoc, ...documents]);
    setUploadFile(null);
    setUploadTags("");

    toast({
      title: "Document uploaded",
      description: "Your document is being processed and will be available shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a document to analyze with AI or use in your queries.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Select File</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  {uploadFile ? (
                    <div className="space-y-2">
                      <FileText className="mx-auto h-8 w-8 text-blue-500" />
                      <p className="text-sm font-medium">{uploadFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setUploadFile(null)}
                      >
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">Drop your file here or click to browse</p>
                      <p className="text-xs text-muted-foreground">
                        Supports PDF, DOCX, XLSX, CSV, TXT (max 20MB)
                      </p>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Browse Files
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="Finance, Report, Analysis"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setUploadFile(null);
                setUploadTags("");
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpload}>
                Upload Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border rounded-md p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Documents</div>
              <div className="text-2xl font-bold">{documents.length}</div>
            </div>
            <div className="border rounded-md p-4">
              <div className="text-sm text-muted-foreground mb-1">Processed</div>
              <div className="text-2xl font-bold">{documents.filter(d => d.status === "Processed").length}</div>
            </div>
            <div className="border rounded-md p-4">
              <div className="text-sm text-muted-foreground mb-1">Processing</div>
              <div className="text-2xl font-bold">{documents.filter(d => d.status === "Processing").length}</div>
            </div>
            <div className="border rounded-md p-4">
              <div className="text-sm text-muted-foreground mb-1">Storage Used</div>
              <div className="text-2xl font-bold">14.2 MB</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" size="sm" className="h-10">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="recent">Recently Added</TabsTrigger>
              <TabsTrigger value="shared">Shared with Me</TabsTrigger>
              <TabsTrigger value="important">Important</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </TableCell>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="bg-muted/50">{tag}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={doc.status === "Processing" ? "secondary" : "default"}
                            className={
                              doc.status === "Processed" ? "bg-green-500/10 text-green-700 hover:bg-green-500/10" :
                              doc.status === "Failed" ? "bg-red-500/10 text-red-700 hover:bg-red-500/10" :
                              "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10"
                            }
                          >
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>{doc.uploadedBy}</TableCell>
                        <TableCell>{new Date(doc.uploadedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" /> Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Tag className="mr-2 h-4 w-4" /> Add Tag
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" /> Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="recent" className="pt-4">
              <div className="flex items-center justify-center h-40 border rounded-md bg-muted/20">
                <div className="text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground/70 mb-3" />
                  <h3 className="font-medium mb-1">Recently Added Documents</h3>
                  <p className="text-sm text-muted-foreground">View your most recently added documents here</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shared" className="pt-4">
              <div className="flex items-center justify-center h-40 border rounded-md bg-muted/20">
                <div className="text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground/70 mb-3" />
                  <h3 className="font-medium mb-1">Shared Documents</h3>
                  <p className="text-sm text-muted-foreground">View documents shared with you here</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="important" className="pt-4">
              <div className="flex items-center justify-center h-40 border rounded-md bg-muted/20">
                <div className="text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground/70 mb-3" />
                  <h3 className="font-medium mb-1">Important Documents</h3>
                  <p className="text-sm text-muted-foreground">View your marked important documents here</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{documents.length}</span> of <span className="font-medium">{documents.length}</span> documents
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
