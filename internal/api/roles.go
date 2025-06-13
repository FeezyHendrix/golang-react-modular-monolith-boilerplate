package api

import (
	"net/http"

	"github.com/feezyhendrix/echoboilerplate/internal/common/validator"
	"github.com/labstack/echo/v4"
)

// Request structs moved to validator/schemas.go
// Use validator.CreateRoleRequest, validator.UpdateRoleRequest, etc.

func (api *api) GetRoles(c echo.Context) error {
	roles, err := api.permissionsService.GetRoles()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get roles")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"roles": roles,
	})
}

func (api *api) GetRole(c echo.Context) error {
	var params validator.IDParam
	if err := c.Bind(&params); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid parameters")
	}
	
	if err := c.Validate(&params); err != nil {
		if validationErr, ok := err.(*validator.ValidationErrors); ok {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{
				"error":   "Validation failed",
				"details": validationErr.Errors,
			})
		}
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid role ID")
	}

	role, err := api.permissionsService.GetRoleByID(params.ID)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Role not found")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"role": role,
	})
}

func (api *api) CreateRole(c echo.Context) error {
	var req validator.CreateRoleRequest
	if err := validator.BindAndValidate(c, &req); err != nil {
		if validationErr, ok := err.(*validator.ValidationErrors); ok {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{
				"error":   "Validation failed",
				"details": validationErr.Errors,
			})
		}
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request")
	}

	role, err := api.permissionsService.CreateRole(req.Name, req.Description)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create role")
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"role": role,
	})
}

func (api *api) UpdateRole(c echo.Context) error {
	var params validator.IDParam
	if err := c.Bind(&params); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid parameters")
	}
	
	if err := c.Validate(&params); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid role ID")
	}

	var req validator.UpdateRoleRequest
	if err := validator.BindAndValidate(c, &req); err != nil {
		if validationErr, ok := err.(*validator.ValidationErrors); ok {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{
				"error":   "Validation failed",
				"details": validationErr.Errors,
			})
		}
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request")
	}

	role, err := api.permissionsService.UpdateRole(params.ID, req.Name, req.Description)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update role")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"role": role,
	})
}

func (api *api) DeleteRole(c echo.Context) error {
	var params validator.IDParam
	if err := c.Bind(&params); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid parameters")
	}
	
	if err := c.Validate(&params); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid role ID")
	}

	if err := api.permissionsService.DeleteRole(params.ID); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Role deleted successfully",
	})
}

func (api *api) AssignRoleToUser(c echo.Context) error {
	var req validator.AssignRoleRequest
	if err := validator.BindAndValidate(c, &req); err != nil {
		if validationErr, ok := err.(*validator.ValidationErrors); ok {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{
				"error":   "Validation failed",
				"details": validationErr.Errors,
			})
		}
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request")
	}

	if err := api.permissionsService.AssignRoleToUser(req.UserID, req.RoleID); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Role assigned successfully",
	})
}

func (api *api) RemoveRoleFromUser(c echo.Context) error {
	var params validator.UserRoleParams
	if err := c.Bind(&params); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid parameters")
	}
	
	if err := c.Validate(&params); err != nil {
		if validationErr, ok := err.(*validator.ValidationErrors); ok {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{
				"error":   "Validation failed",
				"details": validationErr.Errors,
			})
		}
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid parameters")
	}

	if err := api.permissionsService.RemoveRoleFromUser(params.UserID, params.RoleID); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to remove role")
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Role removed successfully",
	})
}

func (api *api) GetPermissions(c echo.Context) error {
	permissions, err := api.permissionsService.GetPermissions()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get permissions")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"permissions": permissions,
	})
}

func (api *api) AssignPermissionToRole(c echo.Context) error {
	var req validator.AssignPermissionRequest
	if err := validator.BindAndValidate(c, &req); err != nil {
		if validationErr, ok := err.(*validator.ValidationErrors); ok {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{
				"error":   "Validation failed",
				"details": validationErr.Errors,
			})
		}
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request")
	}

	if err := api.permissionsService.AssignPermissionToRole(req.RoleID, req.PermissionID); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to assign permission")
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Permission assigned successfully",
	})
}

func (api *api) RemovePermissionFromRole(c echo.Context) error {
	var params validator.RolePermissionParams
	if err := c.Bind(&params); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid parameters")
	}
	
	if err := c.Validate(&params); err != nil {
		if validationErr, ok := err.(*validator.ValidationErrors); ok {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{
				"error":   "Validation failed",
				"details": validationErr.Errors,
			})
		}
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid parameters")
	}

	if err := api.permissionsService.RemovePermissionFromRole(params.RoleID, params.PermissionID); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to remove permission")
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Permission removed successfully",
	})
}

func (api *api) GetUserRoles(c echo.Context) error {
	var params validator.UserIDParam
	if err := c.Bind(&params); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid parameters")
	}
	
	if err := c.Validate(&params); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid user ID")
	}

	roles, err := api.permissionsService.GetUserRoles(params.UserID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get user roles")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"roles": roles,
	})
}

func (api *api) GetUserPermissions(c echo.Context) error {
	var params validator.UserIDParam
	if err := c.Bind(&params); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid parameters")
	}
	
	if err := c.Validate(&params); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid user ID")
	}

	permissions, err := api.permissionsService.GetUserPermissions(params.UserID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get user permissions")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"permissions": permissions,
	})
}