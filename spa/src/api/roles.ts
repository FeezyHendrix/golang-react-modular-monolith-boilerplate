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

export const roleApi = {
  getRoles: () => axiosPrivate.get<{ roles: Role[] }>('/roles'),

  getRole: (id: number) => axiosPrivate.get<{ role: Role }>(`/roles/${id}`),

  createRole: (data: CreateRoleRequest) => 
    axiosPrivate.post<{ role: Role }>('/roles', data),

  updateRole: (id: number, data: CreateRoleRequest) => 
    axiosPrivate.put<{ role: Role }>(`/roles/${id}`, data),

  deleteRole: (id: number) => 
    axiosPrivate.delete<{ message: string }>(`/roles/${id}`),

  assignRoleToUser: (data: AssignRoleRequest) => 
    axiosPrivate.post<{ message: string }>('/user-roles/assign', data),

  removeRoleFromUser: (userId: number, roleId: number) => 
    axiosPrivate.delete<{ message: string }>(`/user-roles/user/${userId}/role/${roleId}`),

  getUserRoles: (userId: number) => 
    axiosPrivate.get<{ roles: Role[] }>(`/user-roles/user/${userId}`),

  getUserPermissions: (userId: number) => 
    axiosPrivate.get<{ permissions: string[] }>(`/user-roles/user/${userId}/permissions`),
};

export const permissionApi = {
  getPermissions: () => axiosPrivate.get<{ permissions: Permission[] }>('/permissions'),

  assignPermissionToRole: (data: AssignPermissionRequest) => 
    axiosPrivate.post<{ message: string }>('/role-permissions/assign', data),

  removePermissionFromRole: (roleId: number, permissionId: number) => 
    axiosPrivate.delete<{ message: string }>(`/role-permissions/role/${roleId}/permission/${permissionId}`),
};