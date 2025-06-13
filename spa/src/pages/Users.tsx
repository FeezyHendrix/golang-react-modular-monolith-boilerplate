import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, UserPlus, Filter, Edit, Trash, UserCircle, Mail, Lock } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
};

const Users: React.FC = () => {
  const { toast } = useToast();
  // Sample user data - would come from an API in a real app
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", lastActive: "Apr 9, 2025" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active", lastActive: "Apr 10, 2025" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Viewer", status: "Inactive", lastActive: "Mar 28, 2025" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "Editor", status: "Active", lastActive: "Apr 11, 2025" },
    { id: 5, name: "Michael Brown", email: "michael@example.com", role: "Viewer", status: "Pending", lastActive: "Apr 8, 2025" },
    { id: 6, name: "Lisa Davis", email: "lisa@example.com", role: "Admin", status: "Active", lastActive: "Apr 11, 2025" },
    { id: 7, name: "David Miller", email: "david@example.com", role: "Viewer", status: "Active", lastActive: "Apr 9, 2025" },
    { id: 8, name: "Emily Wilson", email: "emily@example.com", role: "Editor", status: "Inactive", lastActive: "Apr 5, 2025" },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Viewer",
  });

  const [currentEditUser, setCurrentEditUser] = useState<User | null>(null);

  const handleAddUser = () => {
    // Validation
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    // Add new user
    const newId = Math.max(...users.map(user => user.id)) + 1;
    setUsers([
      ...users,
      {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "Pending",
        lastActive: "Never",
      }
    ]);

    // Reset form
    setNewUser({
      name: "",
      email: "",
      role: "Viewer",
    });

    toast({
      title: "User added",
      description: "The user has been added successfully.",
    });
  };

  const handleEditUser = () => {
    if (!currentEditUser) return;

    // Update user
    setUsers(users.map(user => 
      user.id === currentEditUser.id ? currentEditUser : user
    ));

    toast({
      title: "User updated",
      description: "The user has been updated successfully.",
    });

    setCurrentEditUser(null);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    
    toast({
      title: "User deleted",
      description: "The user has been deleted successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Add a new user to your organization. They will receive an email invitation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewUser({ name: "", email: "", role: "Viewer" })}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === "Active" ? "bg-green-100 text-green-800" : 
                    user.status === "Inactive" ? "bg-gray-100 text-gray-800" : 
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.lastActive}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setCurrentEditUser(user)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                          Make changes to the user's information.
                        </DialogDescription>
                      </DialogHeader>
                      {currentEditUser && (
                        <div className="grid gap-4 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserCircle className="h-8 w-8 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="font-medium">{currentEditUser.name}</h3>
                              <p className="text-sm text-muted-foreground">{currentEditUser.email}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input 
                              id="edit-name" 
                              value={currentEditUser.name}
                              onChange={(e) => setCurrentEditUser({ ...currentEditUser, name: e.target.value })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <div className="flex items-center gap-2">
                              <Input 
                                id="edit-email" 
                                value={currentEditUser.email}
                                onChange={(e) => setCurrentEditUser({ ...currentEditUser, email: e.target.value })}
                              />
                              <Button variant="outline" size="icon">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select 
                              value={currentEditUser.role}
                              onValueChange={(value) => setCurrentEditUser({ ...currentEditUser, role: value })}
                            >
                              <SelectTrigger id="edit-role">
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Editor">Editor</SelectItem>
                                <SelectItem value="Viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select 
                              value={currentEditUser.status}
                              onValueChange={(value) => setCurrentEditUser({ ...currentEditUser, status: value })}
                            >
                              <SelectTrigger id="edit-status">
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="pt-2">
                            <Button variant="outline" className="w-full" size="sm">
                              <Lock className="h-4 w-4 mr-2" />
                              Reset Password
                            </Button>
                          </div>
                        </div>
                      )}
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            if (currentEditUser) {
                              handleDeleteUser(currentEditUser.id);
                              setCurrentEditUser(null);
                            }
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete User
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setCurrentEditUser(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditUser}>Save Changes</Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>1-8</strong> of <strong>8</strong> users
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Users;
