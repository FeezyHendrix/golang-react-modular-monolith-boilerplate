import { axiosPrivate } from './client';

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
  getRoles: () => axiosPrivate.get<{ roles: Role[] }>('/roles'),

  // Get role by ID
  getRole: (id: number) => axiosPrivate.get<{ role: Role }>(`/roles/${id}`),

  // Create new role
  createRole: (data: CreateRoleRequest) => 
    axiosPrivate.post<{ role: Role }>('/roles', data),

  // Update role
  updateRole: (id: number, data: CreateRoleRequest) => 
    axiosPrivate.put<{ role: Role }>(`/roles/${id}`, data),

  // Delete role
  deleteRole: (id: number) => 
    axiosPrivate.delete<{ message: string }>(`/roles/${id}`),

  // Assign role to user
  assignRoleToUser: (data: AssignRoleRequest) => 
    axiosPrivate.post<{ message: string }>('/user-roles/assign', data),

  // Remove role from user
  removeRoleFromUser: (userId: number, roleId: number) => 
    axiosPrivate.delete<{ message: string }>(`/user-roles/user/${userId}/role/${roleId}`),

  // Get user roles
  getUserRoles: (userId: number) => 
    axiosPrivate.get<{ roles: Role[] }>(`/user-roles/user/${userId}`),

  // Get user permissions
  getUserPermissions: (userId: number) => 
    axiosPrivate.get<{ permissions: string[] }>(`/user-roles/user/${userId}/permissions`),
};

// Permission management APIs
export const permissionApi = {
  // Get all permissions
  getPermissions: () => axiosPrivate.get<{ permissions: Permission[] }>('/permissions'),

  // Assign permission to role
  assignPermissionToRole: (data: AssignPermissionRequest) => 
    axiosPrivate.post<{ message: string }>('/role-permissions/assign', data),

  // Remove permission from role
  removePermissionFromRole: (roleId: number, permissionId: number) => 
    axiosPrivate.delete<{ message: string }>(`/role-permissions/role/${roleId}/permission/${permissionId}`),
};