package api

import (
	"net/http"

	"github.com/feezyhendrix/echoboilerplate/internal/common/validator"
	"github.com/feezyhendrix/echoboilerplate/internal/services/permissions"
	"github.com/labstack/echo/v4"

	echoMW "github.com/labstack/echo/v4/middleware"
)

func (a *api) configureRoutes() http.Handler {
	e := echo.New()
	
	e.Validator = validator.NewValidator()
	
	e.Use(validator.ErrorHandlerMiddleware(a.Logger))
	e.Use(validator.RequestLoggingMiddleware(a.Logger))
	e.Use(validator.SecurityValidationMiddleware())
	e.Use(validator.CORSValidationMiddleware())
	e.Use(validator.RateLimitValidationMiddleware())

	e.GET("/health", a.getHealthLive)

	v1Auth := e.Group("/api/v1/auth")
	v1Auth.POST("/login", a.AuthenticationSvc.PostSignIn)
	v1Auth.POST("/logout", a.AuthenticationSvc.PostSignOut)
	v1Auth.POST("/refresh-token", a.AuthenticationSvc.PostRefreshToken)
	v1Auth.POST("/signup", a.AuthenticationSvc.PostSignUp)

	authMW := a.AuthenticationSvc.AuthenticationMiddleware()

	v1 := e.Group("/api/v1", authMW)

	v1.GET("/user/profile", a.UsersSvc.GetUserProfile)

	roles := v1.Group("/roles", permissions.RequirePermission(permissions.PermissionRoleRead))
	roles.GET("", a.GetRoles)
	roles.GET("/:id", a.GetRole)
	roles.POST("", a.CreateRole, permissions.RequirePermission(permissions.PermissionRoleWrite))
	roles.PUT("/:id", a.UpdateRole, permissions.RequirePermission(permissions.PermissionRoleWrite))
	roles.DELETE("/:id", a.DeleteRole, permissions.RequirePermission(permissions.PermissionRoleDelete))

	perms := v1.Group("/permissions", permissions.RequirePermission(permissions.PermissionRoleRead))
	perms.GET("", a.GetPermissions)

	userRoles := v1.Group("/user-roles", permissions.RequirePermission(permissions.PermissionUserWrite))
	userRoles.POST("/assign", a.AssignRoleToUser)
	userRoles.DELETE("/user/:userId/role/:roleId", a.RemoveRoleFromUser)
	userRoles.GET("/user/:userId", a.GetUserRoles, permissions.RequirePermission(permissions.PermissionUserRead))
	userRoles.GET("/user/:userId/permissions", a.GetUserPermissions, permissions.RequirePermission(permissions.PermissionUserRead))

	rolePerms := v1.Group("/role-permissions", permissions.RequirePermission(permissions.PermissionRoleWrite))
	rolePerms.POST("/assign", a.AssignPermissionToRole)
	rolePerms.DELETE("/role/:roleId/permission/:permissionId", a.RemovePermissionFromRole)

	e.Use(echoMW.GzipWithConfig(echoMW.GzipConfig{
		Level: 5,
	}))
	e.Use(echoMW.StaticWithConfig(echoMW.StaticConfig{
		Root:   a.StaticDir,
		Index:  "index.html",
		Browse: false,
		HTML5:  true,
	}))

	return e
}
