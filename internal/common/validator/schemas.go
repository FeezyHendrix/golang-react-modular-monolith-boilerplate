package validator

// Authentication request schemas
type SignUpRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=100"`
	Email    string `json:"email" validate:"required,email,max=255"`
	Password string `json:"password" validate:"required,strong_password"`
}

type SignInRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=1"`
	Code     string `json:"code,omitempty" validate:"omitempty,len=6,numeric"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required,jwt"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token" validate:"required,min=1"`
	NewPassword string `json:"newPassword" validate:"required,strong_password"`
}

type Enable2FARequest struct {
	Password string `json:"password" validate:"required,min=1"`
}

type Verify2FARequest struct {
	Email string `json:"email" validate:"required,email"`
	Code  string `json:"code" validate:"required,len=6,numeric"`
}

type Disable2FARequest struct {
	Password string `json:"password" validate:"required,min=1"`
	Code     string `json:"code" validate:"required,len=6,numeric"`
}

// Role management request schemas
type CreateRoleRequest struct {
	Name        string `json:"name" validate:"required,role_name"`
	Description string `json:"description" validate:"max=255"`
	IsActive    *bool  `json:"isActive,omitempty"`
}

type UpdateRoleRequest struct {
	Name        string `json:"name" validate:"required,role_name"`
	Description string `json:"description" validate:"max=255"`
	IsActive    *bool  `json:"isActive" validate:"required"`
}

type AssignRoleRequest struct {
	UserID uint `json:"userId" validate:"required,min=1"`
	RoleID uint `json:"roleId" validate:"required,min=1"`
}

type AssignPermissionRequest struct {
	RoleID       uint `json:"roleId" validate:"required,min=1"`
	PermissionID uint `json:"permissionId" validate:"required,min=1"`
}

// User management request schemas
type CreateUserRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=100"`
	Email    string `json:"email" validate:"required,email,max=255"`
	Password string `json:"password" validate:"required,strong_password"`
	RoleIDs  []uint `json:"roleIds,omitempty" validate:"omitempty,dive,min=1"`
}

type UpdateUserRequest struct {
	Name    string `json:"name" validate:"required,min=2,max=100"`
	Email   string `json:"email" validate:"required,email,max=255"`
	IsActive *bool `json:"isActive" validate:"required"`
}

type UpdateUserPasswordRequest struct {
	CurrentPassword string `json:"currentPassword" validate:"required,min=1"`
	NewPassword     string `json:"newPassword" validate:"required,strong_password"`
}

type InviteUserRequest struct {
	Email   string `json:"email" validate:"required,email,max=255"`
	Name    string `json:"name" validate:"required,min=2,max=100"`
	RoleIDs []uint `json:"roleIds,omitempty" validate:"omitempty,dive,min=1"`
}

// URL parameter validation schemas
type IDParam struct {
	ID uint `param:"id" validate:"required,min=1"`
}

type UserIDParam struct {
	UserID uint `param:"userId" validate:"required,min=1"`
}

type RoleIDParam struct {
	RoleID uint `param:"roleId" validate:"required,min=1"`
}

type PermissionIDParam struct {
	PermissionID uint `param:"permissionId" validate:"required,min=1"`
}

type UserRoleParams struct {
	UserID uint `param:"userId" validate:"required,min=1"`
	RoleID uint `param:"roleId" validate:"required,min=1"`
}

type RolePermissionParams struct {
	RoleID       uint `param:"roleId" validate:"required,min=1"`
	PermissionID uint `param:"permissionId" validate:"required,min=1"`
}

// Query parameter validation schemas
type PaginationQuery struct {
	Page     int    `query:"page" validate:"omitempty,min=1"`
	Limit    int    `query:"limit" validate:"omitempty,min=1,max=100"`
	Sort     string `query:"sort" validate:"omitempty,oneof=asc desc"`
	OrderBy  string `query:"orderBy" validate:"omitempty,alpha"`
	Search   string `query:"search" validate:"omitempty,max=100"`
}

type UserFilterQuery struct {
	PaginationQuery
	IsActive *bool  `query:"isActive" validate:"omitempty"`
	RoleID   *uint  `query:"roleId" validate:"omitempty,min=1"`
	Email    string `query:"email" validate:"omitempty,email"`
}

type RoleFilterQuery struct {
	PaginationQuery
	IsActive *bool `query:"isActive" validate:"omitempty"`
}

// Permission validation schemas
type CreatePermissionRequest struct {
	Name        string `json:"name" validate:"required,permission_name"`
	Description string `json:"description" validate:"required,min=5,max=255"`
	Resource    string `json:"resource" validate:"required,alpha,min=2,max=50"`
	Action      string `json:"action" validate:"required,alpha,min=2,max=50"`
}

type UpdatePermissionRequest struct {
	Description string `json:"description" validate:"required,min=5,max=255"`
}

// File upload validation schemas
type FileUploadRequest struct {
	FileType string `json:"fileType" validate:"required,oneof=image document"`
	MaxSize  int64  `json:"maxSize" validate:"omitempty,min=1,max=10485760"` // 10MB max
}

// Settings validation schemas
type UpdateSettingsRequest struct {
	AppName           string `json:"appName" validate:"required,min=2,max=100"`
	AppURL            string `json:"appUrl" validate:"required,url"`
	EmailFrom         string `json:"emailFrom" validate:"required,email"`
	EmailFromName     string `json:"emailFromName" validate:"required,min=2,max=100"`
	PasswordMinLength int    `json:"passwordMinLength" validate:"required,min=8,max=128"`
	SessionTimeout    int    `json:"sessionTimeout" validate:"required,min=300,max=86400"` // 5 minutes to 24 hours
	TwoFactorRequired bool   `json:"twoFactorRequired"`
}

// Audit log validation schemas
type AuditLogQuery struct {
	PaginationQuery
	UserID     *uint  `query:"userId" validate:"omitempty,min=1"`
	Action     string `query:"action" validate:"omitempty,alpha"`
	Resource   string `query:"resource" validate:"omitempty,alpha"`
	StartDate  string `query:"startDate" validate:"omitempty,datetime=2006-01-02T15:04:05Z07:00"`
	EndDate    string `query:"endDate" validate:"omitempty,datetime=2006-01-02T15:04:05Z07:00"`
}

// Report validation schemas
type CreateReportRequest struct {
	Name        string                 `json:"name" validate:"required,min=2,max=100"`
	Description string                 `json:"description" validate:"max=500"`
	Query       string                 `json:"query" validate:"required,min=10"`
	Parameters  map[string]interface{} `json:"parameters,omitempty"`
	IsPublic    bool                   `json:"isPublic"`
}

type UpdateReportRequest struct {
	Name        string                 `json:"name" validate:"required,min=2,max=100"`
	Description string                 `json:"description" validate:"max=500"`
	Query       string                 `json:"query" validate:"required,min=10"`
	Parameters  map[string]interface{} `json:"parameters,omitempty"`
	IsPublic    bool                   `json:"isPublic"`
}

type RunReportRequest struct {
	Parameters map[string]interface{} `json:"parameters,omitempty"`
	Format     string                 `json:"format" validate:"omitempty,oneof=json csv xlsx pdf"`
}

// Webhook validation schemas
type CreateWebhookRequest struct {
	Name        string            `json:"name" validate:"required,min=2,max=100"`
	URL         string            `json:"url" validate:"required,url"`
	Events      []string          `json:"events" validate:"required,dive,alpha"`
	Headers     map[string]string `json:"headers,omitempty"`
	Secret      string            `json:"secret" validate:"omitempty,min=16,max=255"`
	IsActive    bool              `json:"isActive"`
}

type UpdateWebhookRequest struct {
	Name        string            `json:"name" validate:"required,min=2,max=100"`
	URL         string            `json:"url" validate:"required,url"`
	Events      []string          `json:"events" validate:"required,dive,alpha"`
	Headers     map[string]string `json:"headers,omitempty"`
	Secret      string            `json:"secret" validate:"omitempty,min=16,max=255"`
	IsActive    bool              `json:"isActive"`
}