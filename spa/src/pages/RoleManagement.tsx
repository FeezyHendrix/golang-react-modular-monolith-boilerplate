import React, { useState } from 'react';
import { Shield, Users, Grid, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { RoleManagement as RoleManagementComponent } from '../components/roles/RoleManagement';
import { AllUsersRoleManagement } from '../components/roles/UserRoleAssignment';
import { PermissionsMatrix } from '../components/roles/PermissionsMatrix';

export default function RoleManagement() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Access Control & Permissions</h1>
          <p className="text-muted-foreground">Manage roles, permissions, and user access</p>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Role Management
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Assignments
          </TabsTrigger>
          <TabsTrigger value="matrix" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Permissions Matrix
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create and manage roles with specific permissions. Roles define what actions users can perform in the system.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <div className="font-semibold">Super Admin</div>
                    <div className="text-sm text-muted-foreground">Full system access</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="font-semibold">Admin</div>
                    <div className="text-sm text-muted-foreground">User & content management</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="font-semibold">Team</div>
                    <div className="text-sm text-muted-foreground">Collaborative access</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="font-semibold">User</div>
                    <div className="text-sm text-muted-foreground">Basic access</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          <RoleManagementComponent />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Role Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Assign and manage roles for individual users. Users can have multiple roles, and permissions are combined.
              </p>
            </CardContent>
          </Card>
          <AllUsersRoleManagement />
        </TabsContent>

        <TabsContent value="matrix" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permissions Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View and modify the complete permissions matrix. This shows which permissions are assigned to each role.
              </p>
            </CardContent>
          </Card>
          <PermissionsMatrix />
        </TabsContent>
      </Tabs>
    </div>
  );
}