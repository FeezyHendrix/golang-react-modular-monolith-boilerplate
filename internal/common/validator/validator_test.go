package validator

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCustomValidator(t *testing.T) {
	validator := NewValidator()

	tests := []struct {
		name      string
		input     interface{}
		expectErr bool
		errField  string
	}{
		{
			name: "valid sign up request",
			input: SignUpRequest{
				Name:     "John Doe",
				Email:    "john@example.com",
				Password: "SecurePass123!",
			},
			expectErr: false,
		},
		{
			name: "invalid email",
			input: SignUpRequest{
				Name:     "John Doe",
				Email:    "invalid-email",
				Password: "SecurePass123!",
			},
			expectErr: true,
			errField:  "email",
		},
		{
			name: "weak password",
			input: SignUpRequest{
				Name:     "John Doe",
				Email:    "john@example.com",
				Password: "weak",
			},
			expectErr: true,
			errField:  "password",
		},
		{
			name: "missing required fields",
			input: SignUpRequest{
				Email: "john@example.com",
			},
			expectErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.Validate(tt.input)
			
			if tt.expectErr {
				assert.Error(t, err)
				if tt.errField != "" {
					validationErr, ok := err.(*ValidationErrors)
					require.True(t, ok)
					
					found := false
					for _, e := range validationErr.Errors {
						if e.Field == tt.errField {
							found = true
							break
						}
					}
					assert.True(t, found, "Expected error for field: %s", tt.errField)
				}
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestStrongPasswordValidation(t *testing.T) {
	tests := []struct {
		password string
		valid    bool
	}{
		{"SecurePass123!", true},
		{"Password1!", true},
		{"ComplexP@ss1", true},
		{"password", false},      // no uppercase, no number, no special
		{"PASSWORD", false},      // no lowercase, no number, no special
		{"Password", false},      // no number, no special
		{"Password1", false},     // no special
		{"Password!", false},     // no number
		{"12345678", false},      // no letters, no special
		{"!@#$%^&*", false},      // no letters, no numbers
		{"Pass1!", false},        // too short
		{"", false},              // empty
	}

	for _, tt := range tests {
		t.Run(tt.password, func(t *testing.T) {
			mockField := &mockFieldLevel{value: tt.password}
			result := validateStrongPassword(mockField)
			assert.Equal(t, tt.valid, result, "Password: %s", tt.password)
		})
	}
}

func TestRoleNameValidation(t *testing.T) {
	tests := []struct {
		name  string
		valid bool
	}{
		{"Admin", true},
		{"Super Admin", true},
		{"Team-Lead", true},
		{"User123", true},
		{"Manager Role", true},
		{"A", false},                    // too short
		{strings.Repeat("A", 51), false}, // too long
		{"Role@Special", false},         // invalid characters
		{"Role#Test", false},            // invalid characters
		{"", false},                     // empty
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockField := &mockFieldLevel{value: tt.name}
			result := validateRoleName(mockField)
			assert.Equal(t, tt.valid, result, "Role name: %s", tt.name)
		})
	}
}

func TestPermissionNameValidation(t *testing.T) {
	tests := []struct {
		name  string
		valid bool
	}{
		{"user:read", true},
		{"role:write", true},
		{"system:admin", true},
		{"report:delete", true},
		{"User:Read", false},     // uppercase not allowed
		{"user-read", false},     // hyphen not allowed
		{"user_read", false},     // underscore not allowed
		{"user:read:extra", false}, // too many parts
		{"user", false},          // missing action
		{":read", false},         // missing resource
		{"user:", false},         // missing action
		{"", false},              // empty
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockField := &mockFieldLevel{value: tt.name}
			result := validatePermissionName(mockField)
			assert.Equal(t, tt.valid, result, "Permission name: %s", tt.name)
		})
	}
}

func TestValidationErrorFormatting(t *testing.T) {
	validator := NewValidator()
	
	input := SignUpRequest{
		Name:     "A", // too short
		Email:    "invalid-email",
		Password: "weak",
	}
	
	err := validator.Validate(input)
	require.Error(t, err)
	
	validationErr, ok := err.(*ValidationErrors)
	require.True(t, ok)
	
	assert.Len(t, validationErr.Errors, 3) // name, email, password errors
	
	// Check that errors contain proper messages
	fieldErrors := make(map[string]ValidationError)
	for _, e := range validationErr.Errors {
		fieldErrors[e.Field] = e
	}
	
	assert.Contains(t, fieldErrors, "name")
	assert.Contains(t, fieldErrors, "email")
	assert.Contains(t, fieldErrors, "password")
	
	assert.Contains(t, fieldErrors["email"].Message, "valid email")
	assert.Contains(t, fieldErrors["password"].Message, "uppercase")
}

func TestBindAndValidateHelper(t *testing.T) {
	e := echo.New()
	e.Validator = NewValidator()

	tests := []struct {
		name        string
		body        string
		contentType string
		expectErr   bool
		statusCode  int
	}{
		{
			name: "valid JSON",
			body: `{"name":"John Doe","email":"john@example.com","password":"SecurePass123!"}`,
			contentType: "application/json",
			expectErr: false,
		},
		{
			name: "invalid JSON format",
			body: `{"name":"John Doe","email":}`,
			contentType: "application/json",
			expectErr: true,
			statusCode: http.StatusBadRequest,
		},
		{
			name: "validation failure",
			body: `{"name":"","email":"invalid","password":"weak"}`,
			contentType: "application/json",
			expectErr: true,
			statusCode: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(tt.body))
			req.Header.Set("Content-Type", tt.contentType)
			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)

			var payload SignUpRequest
			err := BindAndValidate(c, &payload)

			if tt.expectErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, "John Doe", payload.Name)
				assert.Equal(t, "john@example.com", payload.Email)
			}
		})
	}
}

func TestValidateAndBindJSON(t *testing.T) {
	e := echo.New()
	e.Validator = NewValidator()

	// Test valid request
	validJSON := `{"name":"John Doe","email":"john@example.com","password":"SecurePass123!"}`
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(validJSON))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	var payload SignUpRequest
	err := ValidateAndBindJSON(c, &payload)
	assert.NoError(t, err)
	assert.Equal(t, "John Doe", payload.Name)

	// Test invalid request
	invalidJSON := `{"name":"","email":"invalid","password":"weak"}`
	req = httptest.NewRequest(http.MethodPost, "/", strings.NewReader(invalidJSON))
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	var payload2 SignUpRequest
	err = ValidateAndBindJSON(c, &payload2)
	assert.Error(t, err)
	
	// Check that response was written
	if rec.Code != 0 {
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		
		var response map[string]interface{}
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "Validation failed", response["error"])
		assert.NotNil(t, response["details"])
	}
}

func TestParseAndValidateID(t *testing.T) {
	e := echo.New()
	
	tests := []struct {
		name      string
		paramName string
		paramValue string
		expectErr bool
		expectedID uint
	}{
		{
			name: "valid ID",
			paramName: "id",
			paramValue: "123",
			expectErr: false,
			expectedID: 123,
		},
		{
			name: "zero ID",
			paramName: "id",
			paramValue: "0",
			expectErr: true,
		},
		{
			name: "negative ID",
			paramName: "id",
			paramValue: "-1",
			expectErr: true,
		},
		{
			name: "non-numeric ID",
			paramName: "id",
			paramValue: "abc",
			expectErr: true,
		},
		{
			name: "empty ID",
			paramName: "id",
			paramValue: "",
			expectErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/", nil)
			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)
			c.SetParamNames(tt.paramName)
			c.SetParamValues(tt.paramValue)

			id, err := ParseAndValidateID(c, tt.paramName)

			if tt.expectErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expectedID, id)
			}
		})
	}
}

func TestValidateEmailHelper(t *testing.T) {
	tests := []struct {
		email     string
		expectErr bool
	}{
		{"valid@example.com", false},
		{"", true},                           // empty
		{strings.Repeat("a", 250) + "@example.com", true}, // too long
	}

	for _, tt := range tests {
		t.Run(tt.email, func(t *testing.T) {
			err := ValidateEmail(tt.email)
			if tt.expectErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestValidatePasswordHelper(t *testing.T) {
	tests := []struct {
		password  string
		expectErr bool
	}{
		{"SecurePass123!", false},
		{"", true},                      // empty
		{"weak", true},                  // too short and weak
		{strings.Repeat("a", 130), true}, // too long
		{"Password1", true},             // missing special character
	}

	for _, tt := range tests {
		t.Run(tt.password, func(t *testing.T) {
			err := ValidatePassword(tt.password)
			if tt.expectErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestValidateRoleNameHelper(t *testing.T) {
	tests := []struct {
		name      string
		expectErr bool
	}{
		{"Admin", false},
		{"Super Admin", false},
		{"", true},                         // empty
		{"A", true},                        // too short
		{strings.Repeat("A", 51), true},    // too long
		{"Role@Special", true},             // invalid characters
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateRoleName(tt.name)
			if tt.expectErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}