package validator

import (
	"context"
	"fmt"
	"net/http"
	"reflect"
	"regexp"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

type CustomValidator struct {
	Validator *validator.Validate
}

type ValidationError struct {
	Field   string `json:"field"`
	Tag     string `json:"tag"`
	Value   string `json:"value"`
	Message string `json:"message"`
}

type ValidationErrors struct {
	Errors []ValidationError `json:"errors"`
}

func (ve *ValidationErrors) Error() string {
	if len(ve.Errors) == 0 {
		return "validation failed"
	}
	return fmt.Sprintf("validation failed: %s", ve.Errors[0].Message)
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.Validator.Struct(i); err != nil {
		return formatValidationErrors(err)
	}
	return nil
}

func formatValidationErrors(err error) *ValidationErrors {
	var validationErrors []ValidationError
	
	if validationErrs, ok := err.(validator.ValidationErrors); ok {
		for _, err := range validationErrs {
			validationErrors = append(validationErrors, ValidationError{
				Field:   getJSONFieldName(err),
				Tag:     err.Tag(),
				Value:   fmt.Sprintf("%v", err.Value()),
				Message: getErrorMessage(err),
			})
		}
	}
	
	return &ValidationErrors{Errors: validationErrors}
}

func getJSONFieldName(err validator.FieldError) string {
	field := err.StructField()
	if field != "" {
		if tag := reflect.StructTag(field).Get("json"); tag != "" {
			return strings.Split(tag, ",")[0]
		}
	}
	return strings.ToLower(err.Field())
}

func getErrorMessage(err validator.FieldError) string {
	switch err.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", err.Field())
	case "email":
		return "Must be a valid email address"
	case "min":
		return fmt.Sprintf("Must be at least %s characters long", err.Param())
	case "max":
		return fmt.Sprintf("Must be no more than %s characters long", err.Param())
	case "alphanum":
		return "Must contain only letters and numbers"
	case "alpha":
		return "Must contain only letters"
	case "numeric":
		return "Must be numeric"
	case "url":
		return "Must be a valid URL"
	case "uuid":
		return "Must be a valid UUID"
	case "jwt":
		return "Must be a valid JWT token"
	case "strong_password":
		return "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character"
	case "role_name":
		return "Role name must be 2-50 characters and contain only letters, numbers, spaces, and hyphens"
	case "permission_name":
		return "Permission name must be in format 'resource:action'"
	default:
		return fmt.Sprintf("Invalid value for %s", err.Field())
	}
}

// Helper method. I think this should be standard part of the echo library
func BindAndValidate(c echo.Context, i any) error {
	if err := c.Bind(i); err != nil {
		return err
	}

	return c.Validate(i)
}

type requestPayloadKey string

const (
	requestPayloadCtxKey = requestPayloadKey("RequestValidatorMW__payload-key")
)

// NewValidator creates a new validator with custom validation rules
func NewValidator() *CustomValidator {
	validate := validator.New()
	
	// Register custom validation functions
	validate.RegisterValidation("strong_password", validateStrongPassword)
	validate.RegisterValidation("role_name", validateRoleName)
	validate.RegisterValidation("permission_name", validatePermissionName)
	validate.RegisterValidation("jwt", validateJWT)
	
	// Register JSON tag name function
	validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
	
	return &CustomValidator{Validator: validate}
}

// Custom validation functions
func validateStrongPassword(fl validator.FieldLevel) bool {
	password := fl.Field().String()
	if len(password) < 8 {
		return false
	}
	
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasNumber := regexp.MustCompile(`[0-9]`).MatchString(password)
	hasSpecial := regexp.MustCompile(`[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]`).MatchString(password)
	
	return hasUpper && hasLower && hasNumber && hasSpecial
}

func validateRoleName(fl validator.FieldLevel) bool {
	name := fl.Field().String()
	if len(name) < 2 || len(name) > 50 {
		return false
	}
	
	// Allow letters, numbers, spaces, and hyphens
	matched, _ := regexp.MatchString(`^[a-zA-Z0-9\s\-]+$`, name)
	return matched
}

func validatePermissionName(fl validator.FieldLevel) bool {
	name := fl.Field().String()
	// Permission format: resource:action
	matched, _ := regexp.MatchString(`^[a-z]+:[a-z]+$`, name)
	return matched
}

func validateJWT(fl validator.FieldLevel) bool {
	token := fl.Field().String()
	// Basic JWT format check (3 parts separated by dots)
	parts := strings.Split(token, ".")
	return len(parts) == 3
}

func RequestValidatorMW(lgr *zap.Logger, payload any) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if err := BindAndValidate(c, payload); err != nil {
				lgr.Info("validation failed", zap.Any("payload", payload), zap.Error(err))
				
				// Return formatted validation errors
				if validationErr, ok := err.(*ValidationErrors); ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"error":   "Validation failed",
						"details": validationErr.Errors,
					})
				}
				
				return c.JSON(http.StatusBadRequest, map[string]interface{}{
					"error":   "Invalid request format",
					"details": err.Error(),
				})
			}
			newCtx := context.WithValue(c.Request().Context(), requestPayloadCtxKey, payload)
			c.SetRequest(c.Request().WithContext(newCtx))
			return next(c)
		}
	}
}

func MustGetPayload[T any](c echo.Context) T {
	return c.Request().Context().Value(requestPayloadCtxKey).(T)
}
