package models

import (
	"time"
)

type Role struct {
	ID          uint               `gorm:"primaryKey" json:"id"`
	Name        string             `gorm:"size:50;not null;unique" json:"name"`
	Description string             `gorm:"size:255" json:"description"`
	Permissions []RolePermission   `gorm:"foreignKey:RoleID" json:"permissions,omitempty"`
	UserRoles   []UserRole         `gorm:"foreignKey:RoleID" json:"userRoles,omitempty"`
	CreatedAt   time.Time          `json:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt"`
}

type Permission struct {
	ID          uint               `gorm:"primaryKey" json:"id"`
	Name        string             `gorm:"size:100;not null;unique" json:"name"`
	Description string             `gorm:"size:255" json:"description"`
	Roles       []RolePermission   `gorm:"foreignKey:PermissionID" json:"roles,omitempty"`
	CreatedAt   time.Time          `json:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt"`
}

type UserRole struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null" json:"userId"`
	RoleID    uint      `gorm:"not null" json:"roleId"`
	User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Role      Role      `gorm:"foreignKey:RoleID" json:"role,omitempty"`
	AssignedBy uint     `json:"assignedBy,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type RolePermission struct {
	ID           uint       `gorm:"primaryKey" json:"id"`
	RoleID       uint       `gorm:"not null" json:"roleId"`
	PermissionID uint       `gorm:"not null" json:"permissionId"`
	Role         Role       `gorm:"foreignKey:RoleID" json:"role,omitempty"`
	Permission   Permission `gorm:"foreignKey:PermissionID" json:"permission,omitempty"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
}

type User struct {
	ID                        uint                     `gorm:"primaryKey" json:"id"`
	Name                      string                   `gorm:"size:255;not null" json:"name"`
	Email                     string                   `gorm:"size:255;not null;unique" json:"email"`
	Password                  string                   `gorm:"size:255;not null" json:"-"`
	LastLogin                 time.Time                `json:"lastLogin,omitempty"`
	EmailConfirmed            bool                     `gorm:"default:false" json:"emailConfirmed"`
	EmailConfirmToken         string                   `gorm:"size:255" json:"-"`
	PasswordResetToken        string                   `gorm:"size:255" json:"-"`
	PasswordResetExpiresAt    time.Time                `json:"passwordResetExpiresAt,omitempty"`
	IsActive                  bool                     `gorm:"default:true" json:"isActive"`
	TwoFactorEnabled          bool                     `gorm:"default:false" json:"twoFactorEnabled"`
	TwoFactorSecret           string                   `gorm:"size:255" json:"-"`
	TwoFactorBackupCodes      string                   `gorm:"size:1023" json:"-"`
	UserRoles                 []UserRole               `gorm:"foreignKey:UserID" json:"userRoles,omitempty"`
	CreatedAt                 time.Time                `json:"createdAt"`
	UpdatedAt                 time.Time                `json:"updatedAt"`
}

func (u *User) GetRoles() []Role {
	roles := make([]Role, len(u.UserRoles))
	for i, userRole := range u.UserRoles {
		roles[i] = userRole.Role
	}
	return roles
}

func (u *User) GetPermissions() []string {
	permissionsMap := make(map[string]bool)
	for _, userRole := range u.UserRoles {
		for _, rolePermission := range userRole.Role.Permissions {
			permissionsMap[rolePermission.Permission.Name] = true
		}
	}
	
	permissions := make([]string, 0, len(permissionsMap))
	for permission := range permissionsMap {
		permissions = append(permissions, permission)
	}
	return permissions
}

func (u *User) HasRole(roleID uint) bool {
	for _, userRole := range u.UserRoles {
		if userRole.RoleID == roleID {
			return true
		}
	}
	return false
}

func (u *User) HasPermission(requiredPermission string) bool {
	userPermissions := u.GetPermissions()
	return hasPermission(userPermissions, requiredPermission)
}

func (u *User) HasAnyPermission(requiredPermissions []string) bool {
	userPermissions := u.GetPermissions()
	return hasAnyPermission(userPermissions, requiredPermissions)
}

func (u *User) HasAllPermissions(requiredPermissions []string) bool {
	userPermissions := u.GetPermissions()
	return hasAllPermissions(userPermissions, requiredPermissions)
}

// Helper functions for permission checking
func hasPermission(userPermissions []string, requiredPermission string) bool {
	for _, permission := range userPermissions {
		if permission == requiredPermission {
			return true
		}
	}
	return false
}

func hasAnyPermission(userPermissions []string, requiredPermissions []string) bool {
	for _, required := range requiredPermissions {
		if hasPermission(userPermissions, required) {
			return true
		}
	}
	return false
}

func hasAllPermissions(userPermissions []string, requiredPermissions []string) bool {
	for _, required := range requiredPermissions {
		if !hasPermission(userPermissions, required) {
			return false
		}
	}
	return true
}