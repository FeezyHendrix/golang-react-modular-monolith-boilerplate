package permissions

import (
	"errors"
	"strings"
	"github.com/feezyhendrix/echoboilerplate/internal/models"
)

const (
	ROLE_ID_ADMIN        = 1
	ROLE_ID_TEAM_ACCOUNT = 2
	ROLE_ID_USER         = 3
	ROLE_ID_SUPER_ADMIN  = 4
)

const (
	PermissionUserRead    = "user:read"
	PermissionUserWrite   = "user:write"
	PermissionUserDelete  = "user:delete"
	PermissionRoleRead    = "role:read"
	PermissionRoleWrite   = "role:write"
	PermissionRoleDelete  = "role:delete"
	PermissionReportRead  = "report:read"
	PermissionReportWrite = "report:write"
	PermissionSettingsRead  = "settings:read"
	PermissionSettingsWrite = "settings:write"
	PermissionSystemAdmin   = "system:admin"
)

const (
	SuperAdminRoleName   = "Super Admin"
	AdminRoleName        = "Admin"
	TeamAccountRoleName  = "Team Account"
	UserRoleName         = "User"
)

var ErrInsufficientPermissions = errors.New("insufficient permissions")
var ErrInvalidRole = errors.New("invalid role")

func GetDefaultPermissions() []models.Permission {
	return []models.Permission{
		{Name: PermissionUserRead, Description: "Read user information"},
		{Name: PermissionUserWrite, Description: "Create and update users"},
		{Name: PermissionUserDelete, Description: "Delete users"},
		{Name: PermissionRoleRead, Description: "Read role information"},
		{Name: PermissionRoleWrite, Description: "Create and update roles"},
		{Name: PermissionRoleDelete, Description: "Delete roles"},
		{Name: PermissionReportRead, Description: "View reports"},
		{Name: PermissionReportWrite, Description: "Create and modify reports"},
		{Name: PermissionSettingsRead, Description: "View system settings"},
		{Name: PermissionSettingsWrite, Description: "Modify system settings"},
		{Name: PermissionSystemAdmin, Description: "Full system administration"},
	}
}

func GetDefaultRoles() []models.Role {
	return []models.Role{
		{
			ID:          ROLE_ID_SUPER_ADMIN,
			Name:        SuperAdminRoleName,
			Description: "Full system access with all permissions",
		},
		{
			ID:          ROLE_ID_ADMIN,
			Name:        AdminRoleName,
			Description: "Administrative access with user and role management",
		},
		{
			ID:          ROLE_ID_TEAM_ACCOUNT,
			Name:        TeamAccountRoleName,
			Description: "Team member with report and user management permissions",
		},
		{
			ID:          ROLE_ID_USER,
			Name:        UserRoleName,
			Description: "Basic user with read-only access",
		},
	}
}

func GetDefaultRolePermissions() map[uint][]string {
	return map[uint][]string{
		ROLE_ID_SUPER_ADMIN: {
			PermissionUserRead, PermissionUserWrite, PermissionUserDelete,
			PermissionRoleRead, PermissionRoleWrite, PermissionRoleDelete,
			PermissionReportRead, PermissionReportWrite,
			PermissionSettingsRead, PermissionSettingsWrite,
			PermissionSystemAdmin,
		},
		ROLE_ID_ADMIN: {
			PermissionUserRead, PermissionUserWrite,
			PermissionRoleRead,
			PermissionReportRead, PermissionReportWrite,
			PermissionSettingsRead,
		},
		ROLE_ID_TEAM_ACCOUNT: {
			PermissionUserRead,
			PermissionReportRead, PermissionReportWrite,
		},
		ROLE_ID_USER: {
			PermissionReportRead,
		},
	}
}

func HasPermission(userPermissions []string, requiredPermission string) bool {
	for _, permission := range userPermissions {
		if permission == requiredPermission {
			return true
		}
		if permission == PermissionSystemAdmin {
			return true
		}
	}
	return false
}

func HasAnyPermission(userPermissions []string, requiredPermissions []string) bool {
	for _, required := range requiredPermissions {
		if HasPermission(userPermissions, required) {
			return true
		}
	}
	return false
}

func HasAllPermissions(userPermissions []string, requiredPermissions []string) bool {
	for _, required := range requiredPermissions {
		if !HasPermission(userPermissions, required) {
			return false
		}
	}
	return true
}

func ParsePermission(permission string) (resource string, action string, err error) {
	parts := strings.Split(permission, ":")
	if len(parts) != 2 {
		return "", "", errors.New("invalid permission format")
	}
	return parts[0], parts[1], nil
}

func ValidateRole(roleID uint) bool {
	validRoles := []uint{ROLE_ID_ADMIN, ROLE_ID_TEAM_ACCOUNT, ROLE_ID_USER, ROLE_ID_SUPER_ADMIN}
	for _, validRole := range validRoles {
		if roleID == validRole {
			return true
		}
	}
	return false
}
