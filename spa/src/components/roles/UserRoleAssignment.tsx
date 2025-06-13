import React, { useState, useEffect } from 'react';
import { Plus, X, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { roleApi, Role, userApi } from '../../api/roles';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserRoleAssignmentProps {
  userId: number;
  userName: string;
}

export function UserRoleAssignment({ userId, userName }: UserRoleAssignmentProps) {
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

  useEffect(() => {
    loadUserRoles();
    loadAvailableRoles();
  }, [userId]);

  const loadUserRoles = async () => {
    try {
      const response = await roleApi.getUserRoles(userId);
      setUserRoles(response.data.roles);
    } catch (err) {
      setError('Failed to load user roles');
      console.error(err);
    }
  };

  const loadAvailableRoles = async () => {
    try {
      const response = await roleApi.getRoles();
      setAvailableRoles(response.data.roles.filter(role => role.isActive));
      setLoading(false);
    } catch (err) {
      setError('Failed to load available roles');
      console.error(err);
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedRoleId) return;

    try {
      await roleApi.assignRoleToUser({
        userId,
        roleId: parseInt(selectedRoleId)
      });
      setIsAssignDialogOpen(false);
      setSelectedRoleId('');
      loadUserRoles();
    } catch (err) {
      setError('Failed to assign role');
      console.error(err);
    }
  };

  const handleRemoveRole = async (roleId: number) => {
    try {
      await roleApi.removeRoleFromUser(userId, roleId);
      loadUserRoles();
    } catch (err) {
      setError('Failed to remove role');
      console.error(err);
    }
  };

  const getUnassignedRoles = () => {
    const assignedRoleIds = userRoles.map(role => role.id);
    return availableRoles.filter(role => !assignedRoleIds.includes(role.id));
  };

  if (loading) return <div>Loading roles...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Roles for {userName}
          </CardTitle>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Assign Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Role to {userName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Role</label>
                  <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnassignedRoles().map(role => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{role.name}</span>
                            <span className="text-xs text-muted-foreground">{role.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAssignRole} disabled={!selectedRoleId}>
                    Assign Role
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {userRoles.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No roles assigned</p>
        ) : (
          <div className="space-y-2">
            {userRoles.map(role => (
              <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{role.name}</span>
                    {!role.isActive && <Badge variant="secondary">Inactive</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {role.permissions.slice(0, 3).map(permission => (
                      <Badge key={permission.id} variant="outline" className="text-xs">
                        {permission.name}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveRole(role.id)}
                  disabled={role.id <= 4} // Prevent removal of system roles
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component for managing all users' roles
export function AllUsersRoleManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This would need to be implemented in the user API
    // loadUsers();
    setLoading(false);
  }, []);

  // Placeholder - would need actual user API
  const mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Role Management</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {mockUsers.map(user => (
          <UserRoleAssignment
            key={user.id}
            userId={user.id}
            userName={user.name}
          />
        ))}
      </div>
    </div>
  );
}