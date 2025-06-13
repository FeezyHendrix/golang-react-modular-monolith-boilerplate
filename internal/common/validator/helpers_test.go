package validator

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// ValidateAndBindJSON is a helper function to bind and validate JSON payloads
func ValidateAndBindJSON[T any](c echo.Context, payload *T) error {
	if err := c.Bind(payload); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "Invalid JSON format",
			"details": err.Error(),
		})
	}

	if err := c.Validate(payload); err != nil {
		if validationErr, ok := err.(*ValidationErrors); ok {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{
				"error":   "Validation failed",
				"details": validationErr.Errors,
			})
		}
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "Validation failed",
			"details": err.Error(),
		})
	}

	return nil
}

// ValidateAndBindParams is a helper function to bind and validate URL parameters
func ValidateAndBindParams[T any](c echo.Context, params *T) error {
	if err := c.Bind(params); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid parameters")
	}

	if err := c.Validate(params); err != nil {
		if validationErr, ok := err.(*ValidationErrors); ok {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{
				"error":   "Invalid parameters",
				"details": validationErr.Errors,
			})
		}
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid parameters")
	}

	return nil
}

// ValidateAndBindQuery is a helper function to bind and validate query parameters
func ValidateAndBindQuery[T any](c echo.Context, query *T) error {
	if err := c.Bind(query); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid query parameters")
	}

	if err := c.Validate(query); err != nil {
		if validationErr, ok := err.(*ValidationErrors); ok {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{
				"error":   "Invalid query parameters",
				"details": validationErr.Errors,
			})
		}
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid query parameters")
	}

	return nil
}

// ParseAndValidateID is a helper function to parse and validate ID parameters
func ParseAndValidateID(c echo.Context, paramName string) (uint, error) {
	idStr := c.Param(paramName)
	if idStr == "" {
		return 0, echo.NewHTTPError(http.StatusBadRequest, "Missing "+paramName+" parameter")
	}

	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		return 0, echo.NewHTTPError(http.StatusBadRequest, "Invalid "+paramName+" format")
	}

	if id == 0 {
		return 0, echo.NewHTTPError(http.StatusBadRequest, paramName+" must be greater than 0")
	}

	return uint(id), nil
}

// ValidationMiddleware creates a middleware that validates request payloads
func ValidationMiddleware[T any](payload T) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			var req T
			if err := ValidateAndBindJSON(c, &req); err != nil {
				return err
			}

			// Store validated payload in context
			c.Set("validatedPayload", req)
			return next(c)
		}
	}
}

// GetValidatedPayload retrieves the validated payload from context
func GetValidatedPayload[T any](c echo.Context) T {
	payload, ok := c.Get("validatedPayload").(T)
	if !ok {
		var zero T
		return zero
	}
	return payload
}

// ValidateEmail checks if the email format is valid and not empty
func ValidateEmail(email string) error {
	if email == "" {
		return &ValidationErrors{
			Errors: []ValidationError{
				{Field: "email", Tag: "required", Message: "Email is required"},
			},
		}
	}

	// Basic email validation (the validator library will do more thorough validation)
	if len(email) > 255 {
		return &ValidationErrors{
			Errors: []ValidationError{
				{Field: "email", Tag: "max", Message: "Email must be no more than 255 characters"},
			},
		}
	}

	return nil
}

// ValidatePassword checks if the password meets strength requirements
func ValidatePassword(password string) error {
	errors := []ValidationError{}

	if password == "" {
		errors = append(errors, ValidationError{
			Field: "password", Tag: "required", Message: "Password is required",
		})
	} else {
		if len(password) < 8 {
			errors = append(errors, ValidationError{
				Field: "password", Tag: "min", Message: "Password must be at least 8 characters long",
			})
		}

		if len(password) > 128 {
			errors = append(errors, ValidationError{
				Field: "password", Tag: "max", Message: "Password must be no more than 128 characters long",
			})
		}

		// Check for strong password if not empty and length is valid
		if len(password) >= 8 && len(password) <= 128 {
			if !validateStrongPassword(&mockFieldLevel{value: password}) {
				errors = append(errors, ValidationError{
					Field:   "password",
					Tag:     "strong_password",
					Message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
				})
			}
		}
	}

	if len(errors) > 0 {
		return &ValidationErrors{Errors: errors}
	}

	return nil
}

// mockFieldLevel is a helper struct to use custom validation functions outside of the validator
type mockFieldLevel struct {
	value string
}

func (m *mockFieldLevel) Field() interface{} {
	return m.value
}

func (m *mockFieldLevel) FieldName() string {
	return ""
}

func (m *mockFieldLevel) StructFieldName() string {
	return ""
}

func (m *mockFieldLevel) Param() string {
	return ""
}

func (m *mockFieldLevel) GetTag() string {
	return ""
}

func (m *mockFieldLevel) ExtractType(field interface{}) (interface{}, interface{}, bool) {
	return nil, nil, false
}

func (m *mockFieldLevel) GetStructFieldOK() (interface{}, interface{}, bool) {
	return nil, nil, false
}

func (m *mockFieldLevel) GetStructFieldOKAdvanced(val interface{}, namespace string) (interface{}, interface{}, bool) {
	return nil, nil, false
}

func (m *mockFieldLevel) GetStructFieldOK2() (interface{}, interface{}, bool, bool) {
	return nil, nil, false, false
}

func (m *mockFieldLevel) GetStructFieldOKAdvanced2(val interface{}, namespace string) (interface{}, interface{}, bool, bool) {
	return nil, nil, false, false
}

func (m *mockFieldLevel) Parent() interface{} {
	return nil
}

func (m *mockFieldLevel) Top() interface{} {
	return nil
}

// ValidateRoleName validates role names according to business rules
func ValidateRoleName(name string) error {
	if name == "" {
		return &ValidationErrors{
			Errors: []ValidationError{
				{Field: "name", Tag: "required", Message: "Role name is required"},
			},
		}
	}

	if len(name) < 2 {
		return &ValidationErrors{
			Errors: []ValidationError{
				{Field: "name", Tag: "min", Message: "Role name must be at least 2 characters long"},
			},
		}
	}

	if len(name) > 50 {
		return &ValidationErrors{
			Errors: []ValidationError{
				{Field: "name", Tag: "max", Message: "Role name must be no more than 50 characters long"},
			},
		}
	}

	if !validateRoleName(&mockFieldLevel{value: name}) {
		return &ValidationErrors{
			Errors: []ValidationError{
				{Field: "name", Tag: "role_name", Message: "Role name must contain only letters, numbers, spaces, and hyphens"},
			},
		}
	}

	return nil
}