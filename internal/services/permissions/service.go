package permissions

import (
	"errors"
	"fmt"
	"time"

	"github.com/feezyhendrix/echoboilerplate/internal/models"
	"gorm.io/gorm"
)

type Service struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{db: db}
}

func (s *Service) SeedDefaultData() error {
	if err := s.seedPermissions(); err != nil {
		return fmt.Errorf("failed to seed permissions: %w", err)
	}

	if err := s.seedRoles(); err != nil {
		return fmt.Errorf("failed to seed roles: %w", err)
	}

	if err := s.assignRolePermissions(); err != nil {
		return fmt.Errorf("failed to assign role permissions: %w", err)
	}

	return nil
}

func (s *Service) seedPermissions() error {
	permissions := GetDefaultPermissions()
	for _, permission := range permissions {
		var existingPermission models.Permission
		err := s.db.Where("name = ?", permission.Name).First(&existingPermission).Error
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				permission.CreatedAt = time.Now()
				permission.UpdatedAt = time.Now()
				if err := s.db.Create(&permission).Error; err != nil {
					return fmt.Errorf("failed to create permission %s: %w", permission.Name, err)
				}
			} else {
				return fmt.Errorf("failed to check permission %s: %w", permission.Name, err)
			}
		}
	}
	return nil
}

func (s *Service) seedRoles() error {
	roles := GetDefaultRoles()
	for _, role := range roles {
		var existingRole models.Role
		err := s.db.Where("name = ?", role.Name).First(&existingRole).Error
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				role.CreatedAt = time.Now()
				role.UpdatedAt = time.Now()
				if err := s.db.Create(&role).Error; err != nil {
					return fmt.Errorf("failed to create role %s: %w", role.Name, err)
				}
			} else {
				return fmt.Errorf("failed to check role %s: %w", role.Name, err)
			}
		}
	}
	return nil
}

func (s *Service) assignRolePermissions() error {
	rolePermissions := GetDefaultRolePermissions()
	
	for roleID, permissionNames := range rolePermissions {
		var role models.Role
		if err := s.db.First(&role, roleID).Error; err != nil {
			return fmt.Errorf("failed to find role with ID %d: %w", roleID, err)
		}

		for _, permissionName := range permissionNames {
			var permission models.Permission
			if err := s.db.Where("name = ?", permissionName).First(&permission).Error; err != nil {
				return fmt.Errorf("failed to find permission %s: %w", permissionName, err)
			}

			var existingRolePermission models.RolePermission
			err := s.db.Where("role_id = ? AND permission_id = ?", role.ID, permission.ID).First(&existingRolePermission).Error
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					rolePermission := models.RolePermission{
						RoleID:       role.ID,
						PermissionID: permission.ID,
						CreatedAt:    time.Now(),
						UpdatedAt:    time.Now(),
					}
					if err := s.db.Create(&rolePermission).Error; err != nil {
						return fmt.Errorf("failed to assign permission %s to role %s: %w", permissionName, role.Name, err)
					}
				} else {
					return fmt.Errorf("failed to check role permission assignment: %w", err)
				}
			}
		}
	}
	return nil
}

func (s *Service) CreateRole(name, description string) (*models.Role, error) {
	role := &models.Role{
		Name:        name,
		Description: description,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := s.db.Create(role).Error; err != nil {
		return nil, fmt.Errorf("failed to create role: %w", err)
	}

	return role, nil
}

func (s *Service) GetRoles() ([]models.Role, error) {
	var roles []models.Role
	if err := s.db.Preload("Permissions.Permission").Find(&roles).Error; err != nil {
		return nil, fmt.Errorf("failed to get roles: %w", err)
	}
	return roles, nil
}

func (s *Service) GetRoleByID(id uint) (*models.Role, error) {
	var role models.Role
	if err := s.db.Preload("Permissions.Permission").First(&role, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get role: %w", err)
	}
	return &role, nil
}

func (s *Service) UpdateRole(id uint, name, description string) (*models.Role, error) {
	var role models.Role
	if err := s.db.First(&role, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("role not found")
		}
		return nil, fmt.Errorf("failed to find role: %w", err)
	}

	role.Name = name
	role.Description = description
	role.UpdatedAt = time.Now()

	if err := s.db.Save(&role).Error; err != nil {
		return nil, fmt.Errorf("failed to update role: %w", err)
	}

	return &role, nil
}

func (s *Service) DeleteRole(id uint) error {
	if err := s.db.Delete(&models.Role{}, id).Error; err != nil {
		return fmt.Errorf("failed to delete role: %w", err)
	}
	return nil
}

func (s *Service) GetPermissions() ([]models.Permission, error) {
	var permissions []models.Permission
	if err := s.db.Find(&permissions).Error; err != nil {
		return nil, fmt.Errorf("failed to get permissions: %w", err)
	}
	return permissions, nil
}

func (s *Service) AssignRoleToUser(userID, roleID uint) error {
	var existingUserRole models.UserRole
	err := s.db.Where("user_id = ? AND role_id = ?", userID, roleID).First(&existingUserRole).Error
	if err == nil {
		return errors.New("user already has this role")
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return fmt.Errorf("failed to check existing user role: %w", err)
	}

	userRole := models.UserRole{
		UserID:    userID,
		RoleID:    roleID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := s.db.Create(&userRole).Error; err != nil {
		return fmt.Errorf("failed to assign role to user: %w", err)
	}

	return nil
}

func (s *Service) RemoveRoleFromUser(userID, roleID uint) error {
	if err := s.db.Where("user_id = ? AND role_id = ?", userID, roleID).Delete(&models.UserRole{}).Error; err != nil {
		return fmt.Errorf("failed to remove role from user: %w", err)
	}
	return nil
}

func (s *Service) GetUserRoles(userID uint) ([]models.Role, error) {
	var userRoles []models.UserRole
	if err := s.db.Preload("Role").Where("user_id = ?", userID).Find(&userRoles).Error; err != nil {
		return nil, fmt.Errorf("failed to get user roles: %w", err)
	}

	roles := make([]models.Role, len(userRoles))
	for i, userRole := range userRoles {
		roles[i] = userRole.Role
	}

	return roles, nil
}

func (s *Service) GetUserPermissions(userID uint) ([]string, error) {
	var userRoles []models.UserRole
	if err := s.db.Preload("Role.Permissions.Permission").Where("user_id = ?", userID).Find(&userRoles).Error; err != nil {
		return nil, fmt.Errorf("failed to get user permissions: %w", err)
	}

	permissionsMap := make(map[string]bool)
	for _, userRole := range userRoles {
		for _, rolePermission := range userRole.Role.Permissions {
			permissionsMap[rolePermission.Permission.Name] = true
		}
	}

	permissions := make([]string, 0, len(permissionsMap))
	for permission := range permissionsMap {
		permissions = append(permissions, permission)
	}

	return permissions, nil
}

func (s *Service) AssignPermissionToRole(roleID, permissionID uint) error {
	var existingRolePermission models.RolePermission
	err := s.db.Where("role_id = ? AND permission_id = ?", roleID, permissionID).First(&existingRolePermission).Error
	if err == nil {
		return errors.New("role already has this permission")
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return fmt.Errorf("failed to check existing role permission: %w", err)
	}

	rolePermission := models.RolePermission{
		RoleID:       roleID,
		PermissionID: permissionID,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := s.db.Create(&rolePermission).Error; err != nil {
		return fmt.Errorf("failed to assign permission to role: %w", err)
	}

	return nil
}

func (s *Service) RemovePermissionFromRole(roleID, permissionID uint) error {
	if err := s.db.Where("role_id = ? AND permission_id = ?", roleID, permissionID).Delete(&models.RolePermission{}).Error; err != nil {
		return fmt.Errorf("failed to remove permission from role: %w", err)
	}
	return nil
}