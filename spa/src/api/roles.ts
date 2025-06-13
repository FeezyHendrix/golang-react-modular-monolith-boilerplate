import { apiClient } from './client';

export interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  permissions: Permission[];
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  isActive?: boolean;
}

export interface AssignRoleRequest {
  userId: number;
  roleId: number;
}

export interface AssignPermissionRequest {
  roleId: number;
  permissionId: number;
}

// Role management APIs
export const roleApi = {
  // Get all roles
  getRoles: () => apiClient.get<{ roles: Role[] }>('/api/v1/roles'),

  // Get role by ID
  getRole: (id: number) => apiClient.get<{ role: Role }>(`/api/v1/roles/${id}`),

  // Create new role
  createRole: (data: CreateRoleRequest) => 
    apiClient.post<{ role: Role }>('/api/v1/roles', data),

  // Update role
  updateRole: (id: number, data: CreateRoleRequest) => 
    apiClient.put<{ role: Role }>(`/api/v1/roles/${id}`, data),

  // Delete role
  deleteRole: (id: number) => 
    apiClient.delete<{ message: string }>(`/api/v1/roles/${id}`),

  // Assign role to user
  assignRoleToUser: (data: AssignRoleRequest) => 
    apiClient.post<{ message: string }>('/api/v1/user-roles/assign', data),

  // Remove role from user
  removeRoleFromUser: (userId: number, roleId: number) => 
    apiClient.delete<{ message: string }>(`/api/v1/user-roles/user/${userId}/role/${roleId}`),

  // Get user roles
  getUserRoles: (userId: number) => 
    apiClient.get<{ roles: Role[] }>(`/api/v1/user-roles/user/${userId}`),

  // Get user permissions
  getUserPermissions: (userId: number) => 
    apiClient.get<{ permissions: string[] }>(`/api/v1/user-roles/user/${userId}/permissions`),
};

// Permission management APIs
export const permissionApi = {
  // Get all permissions
  getPermissions: () => apiClient.get<{ permissions: Permission[] }>('/api/v1/permissions'),

  // Assign permission to role
  assignPermissionToRole: (data: AssignPermissionRequest) => 
    apiClient.post<{ message: string }>('/api/v1/role-permissions/assign', data),

  // Remove permission from role
  removePermissionFromRole: (roleId: number, permissionId: number) => 
    apiClient.delete<{ message: string }>(`/api/v1/role-permissions/role/${roleId}/permission/${permissionId}`),
};