import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { roleApi, Role, CreateRoleRequest, Permission, permissionApi } from '../../api/roles';

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesResponse, permissionsResponse] = await Promise.all([
        roleApi.getRoles(),
        permissionApi.getPermissions()
      ]);
      setRoles(rolesResponse.data.roles);
      setPermissions(permissionsResponse.data.permissions);
    } catch (err) {
      setError('Failed to load roles and permissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (data: CreateRoleRequest) => {
    try {
      await roleApi.createRole(data);
      setIsCreateDialogOpen(false);
      loadData();
    } catch (err) {
      setError('Failed to create role');
      console.error(err);
    }
  };

  const handleUpdateRole = async (id: number, data: CreateRoleRequest) => {
    try {
      await roleApi.updateRole(id, data);
      setEditingRole(null);
      loadData();
    } catch (err) {
      setError('Failed to update role');
      console.error(err);
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await roleApi.deleteRole(id);
        loadData();
      } catch (err) {
        setError('Failed to delete role');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Role Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <RoleForm onSubmit={handleCreateRole} onCancel={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {role.name}
                    {!role.isActive && <Badge variant="secondary">Inactive</Badge>}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                      </DialogHeader>
                      <RoleForm
                        role={role}
                        onSubmit={(data) => handleUpdateRole(role.id, data)}
                        onCancel={() => {}}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRole(role.id)}
                    disabled={role.id <= 4}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {role.permissions.length} permissions
                </div>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission) => (
                    <Badge key={permission.id} variant="outline" className="text-xs">
                      {permission.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface RoleFormProps {
  role?: Role;
  onSubmit: (data: CreateRoleRequest) => void;
  onCancel: () => void;
}

function RoleForm({ role, onSubmit, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState<CreateRoleRequest>({
    name: role?.name || '',
    description: role?.description || '',
    isActive: role?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {role ? 'Update' : 'Create'} Role
        </Button>
      </div>
    </form>
  );
}