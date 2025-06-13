package permissions

import (
	"net/http"
	"strings"

	"github.com/feezyhendrix/echoboilerplate/internal/models"
	"github.com/labstack/echo/v4"
)

func RequirePermission(permission string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			user, ok := c.Get("user").(*models.User)
			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "User not authenticated")
			}

			if !user.HasPermission(permission) {
				return echo.NewHTTPError(http.StatusForbidden, "Insufficient permissions")
			}

			return next(c)
		}
	}
}

func RequireAnyPermission(permissions ...string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			user, ok := c.Get("user").(*models.User)
			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "User not authenticated")
			}

			if !user.HasAnyPermission(permissions) {
				return echo.NewHTTPError(http.StatusForbidden, "Insufficient permissions")
			}

			return next(c)
		}
	}
}

func RequireAllPermissions(permissions ...string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			user, ok := c.Get("user").(*models.User)
			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "User not authenticated")
			}

			if !user.HasAllPermissions(permissions) {
				return echo.NewHTTPError(http.StatusForbidden, "Insufficient permissions")
			}

			return next(c)
		}
	}
}

func RequireRole(roleID uint) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			user, ok := c.Get("user").(*models.User)
			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "User not authenticated")
			}

			if !user.HasRole(roleID) {
				return echo.NewHTTPError(http.StatusForbidden, "Insufficient role permissions")
			}

			return next(c)
		}
	}
}

func RequireAnyRole(roleIDs ...uint) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			user, ok := c.Get("user").(*models.User)
			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "User not authenticated")
			}

			hasRole := false
			for _, roleID := range roleIDs {
				if user.HasRole(roleID) {
					hasRole = true
					break
				}
			}

			if !hasRole {
				return echo.NewHTTPError(http.StatusForbidden, "Insufficient role permissions")
			}

			return next(c)
		}
	}
}

func RequireAdminOrOwner() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			user, ok := c.Get("user").(*models.User)
			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "User not authenticated")
			}

			userID := c.Param("id")
			isOwner := userID != "" && userID == string(rune(user.ID))
			isAdmin := user.HasRole(ROLE_ID_ADMIN) || user.HasRole(ROLE_ID_SUPER_ADMIN)

			if !isOwner && !isAdmin {
				return echo.NewHTTPError(http.StatusForbidden, "Access denied: must be owner or admin")
			}

			return next(c)
		}
	}
}

func PermissionBasedFilter(c echo.Context, data interface{}, userPermissions []string) interface{} {
	switch v := data.(type) {
	case []models.User:
		if HasPermission(userPermissions, PermissionUserRead) {
			return v
		}
		return []models.User{}
	case models.User:
		if HasPermission(userPermissions, PermissionUserRead) {
			return v
		}
		return models.User{}
	default:
		return data
	}
}

func SanitizeUserResponse(user *models.User, viewerPermissions []string) *models.User {
	sanitized := *user
	
	if !HasPermission(viewerPermissions, PermissionUserRead) {
		sanitized.Email = ""
		sanitized.LastLogin = user.CreatedAt
		sanitized.UserRoles = nil
	}

	if !HasPermission(viewerPermissions, PermissionSystemAdmin) {
		sanitized.TwoFactorEnabled = false
	}

	return &sanitized
}

func GetPermissionsFromHeader(c echo.Context) []string {
	permissionsHeader := c.Request().Header.Get("X-User-Permissions")
	if permissionsHeader == "" {
		return []string{}
	}
	return strings.Split(permissionsHeader, ",")
}