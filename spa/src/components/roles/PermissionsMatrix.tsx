import React, { useState, useEffect } from 'react';
import { Check, X, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { roleApi, permissionApi, Role, Permission } from '../../api/roles';

export function PermissionsMatrix() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingPermissions, setUpdatingPermissions] = useState<Set<string>>(new Set());

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
      setError('Failed to load permissions matrix');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (role: Role, permission: Permission): boolean => {
    return role.permissions.some(p => p.id === permission.id);
  };

  const togglePermission = async (roleId: number, permissionId: number, hasPermission: boolean) => {
    const key = `${roleId}-${permissionId}`;
    setUpdatingPermissions(prev => new Set(prev).add(key));

    try {
      if (hasPermission) {
        await permissionApi.removePermissionFromRole(roleId, permissionId);
      } else {
        await permissionApi.assignPermissionToRole({ roleId, permissionId });
      }
      await loadData(); // Reload to get updated state
    } catch (err) {
      setError(`Failed to ${hasPermission ? 'remove' : 'assign'} permission`);
      console.error(err);
    } finally {
      setUpdatingPermissions(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const groupPermissionsByResource = () => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach(permission => {
      if (!grouped[permission.resource]) {
        grouped[permission.resource] = [];
      }
      grouped[permission.resource].push(permission);
    });
    return grouped;
  };

  const getResourceColor = (resource: string): string => {
    const colors: Record<string, string> = {
      user: 'bg-blue-100 text-blue-800',
      role: 'bg-green-100 text-green-800',
      report: 'bg-purple-100 text-purple-800',
      settings: 'bg-orange-100 text-orange-800',
      system: 'bg-red-100 text-red-800',
    };
    return colors[resource] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div>Loading permissions matrix...</div>;

  const groupedPermissions = groupPermissionsByResource();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Permissions Matrix</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b font-medium">Permission</th>
                  {roles.map(role => (
                    <th key={role.id} className="text-center p-2 border-b font-medium min-w-[120px]">
                      <div className="flex flex-col items-center gap-1">
                        <span>{role.name}</span>
                        {!role.isActive && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                  <React.Fragment key={resource}>
                    <tr>
                      <td colSpan={roles.length + 1} className="p-2 bg-muted/50">
                        <Badge className={getResourceColor(resource)}>
                          {resource.toUpperCase()} PERMISSIONS
                        </Badge>
                      </td>
                    </tr>
                    {resourcePermissions.map(permission => (
                      <tr key={permission.id} className="hover:bg-muted/50">
                        <td className="p-2 border-b">
                          <div>
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-sm text-muted-foreground">{permission.description}</div>
                          </div>
                        </td>
                        {roles.map(role => {
                          const hasPermissionValue = hasPermission(role, permission);
                          const isUpdating = updatingPermissions.has(`${role.id}-${permission.id}`);
                          const isSystemRole = role.id <= 4;
                          
                          return (
                            <td key={role.id} className="p-2 border-b text-center">
                              <div className="flex justify-center">
                                {isSystemRole ? (
                                  // Show read-only status for system roles
                                  hasPermissionValue ? (
                                    <Check className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <X className="h-5 w-5 text-gray-400" />
                                  )
                                ) : (
                                  <Switch
                                    checked={hasPermissionValue}
                                    onCheckedChange={() => togglePermission(role.id, permission.id, hasPermissionValue)}
                                    disabled={isUpdating}
                                    className="data-[state=checked]:bg-green-600"
                                  />
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map(role => (
              <Card key={role.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    {!role.isActive && <Badge variant="secondary">Inactive</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                  <div className="text-sm">
                    <strong>{role.permissions.length}</strong> permissions assigned
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(
                      role.permissions.reduce((acc, p) => {
                        acc[p.resource] = (acc[p.resource] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([resource, count]) => (
                      <Badge key={resource} variant="outline" className="text-xs">
                        {resource}: {count}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}