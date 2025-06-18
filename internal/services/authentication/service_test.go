package authentication

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/feezyhendrix/echoboilerplate/internal/db"
	"github.com/feezyhendrix/echoboilerplate/internal/models"
	"github.com/feezyhendrix/echoboilerplate/internal/services/email"
	"github.com/feezyhendrix/echoboilerplate/internal/services/users"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type mockEmailService struct{}

func (m *mockEmailService) SendPasswordResetEmail(ctx context.Context, to, name, resetToken string) error {
	return nil
}

func (m *mockEmailService) SendTwoFactorCode(ctx context.Context, to, name, code string) error {
	return nil
}

func (m *mockEmailService) SendWelcomeEmail(ctx context.Context, to, name string) error {
	return nil
}

func (m *mockEmailService) SendEmailConfirmation(ctx context.Context, to, name, confirmToken string) error {
	return nil
}

type mockDB struct {
	db *gorm.DB
}

func (m *mockDB) Connection() *gorm.DB {
	return m.db
}

func setupTestDB(t *testing.T) *mockDB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatal("Failed to connect to test database:", err)
	}

	err = db.AutoMigrate(&models.User{})
	if err != nil {
		t.Fatal("Failed to migrate test database:", err)
	}

	return &mockDB{db: db}
}

func setupTestService(t *testing.T) (*service, *mockDB) {
	logger := zap.NewNop()
	validator := validator.New()
	mockDB := setupTestDB(t)

	cfg := &Config{
		JWTSecret:                  "test-secret",
		AccessTokenTTLSecs:         900,
		RefreshTokenTTLSecs:        86400,
		PasswordResetTokenTTLSecs:  3600,
		PasswordResetEncryptionKey: "test-encryption-key-32-bytes-long",
		PasswordResetURL:           "http://localhost:3000/reset-password",
	}

	userSvc := users.New(&users.Config{}, &users.Dependencies{
		Database: mockDB,
		Logger:   logger,
	})

	emailSvc := &mockEmailService{}

	deps := &Dependencies{
		Validate: validator,
		Logger:   logger,
		Database: mockDB,
		Users:    userSvc,
		Email:    emailSvc,
	}

	return New(cfg, deps).(*service), mockDB
}

func TestPostSignUp(t *testing.T) {
	service, _ := setupTestService(t)
	e := echo.New()

	t.Run("successful signup", func(t *testing.T) {
		payload := PostSignUpRequest{
			Email:    "test@example.com",
			Password: "password123",
			Name:     "Test User",
		}

		body, _ := json.Marshal(payload)
		req := httptest.NewRequest(http.MethodPost, "/signup", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := service.PostSignUp(c)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if rec.Code != http.StatusOK {
			t.Fatalf("Expected status 200, got %d", rec.Code)
		}

		var user models.User
		err = service.Database.Connection().Where("email = ?", payload.Email).First(&user).Error
		if err != nil {
			t.Fatalf("User was not created: %v", err)
		}

		if user.Name != payload.Name {
			t.Fatalf("Expected name %s, got %s", payload.Name, user.Name)
		}
	})

	t.Run("duplicate email signup", func(t *testing.T) {
		user := &models.User{
			Email:    "duplicate@example.com",
			Name:     "Existing User",
			Password: "hashedpassword",
		}
		service.Database.Connection().Create(user)

		payload := PostSignUpRequest{
			Email:    "duplicate@example.com",
			Password: "password123",
			Name:     "New User",
		}

		body, _ := json.Marshal(payload)
		req := httptest.NewRequest(http.MethodPost, "/signup", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := service.PostSignUp(c)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if rec.Code != http.StatusConflict {
			t.Fatalf("Expected status 409, got %d", rec.Code)
		}
	})

	t.Run("invalid request body", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/signup", bytes.NewReader([]byte("invalid json")))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := service.PostSignUp(c)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if rec.Code != http.StatusBadRequest {
			t.Fatalf("Expected status 400, got %d", rec.Code)
		}
	})
}

func TestPostSignIn(t *testing.T) {
	service, _ := setupTestService(t)
	e := echo.New()

	user := &models.User{
		Email:    "signin@example.com",
		Name:     "Sign In User",
		Password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
		IsActive: true,
	}
	service.Database.Connection().Create(user)

	t.Run("successful signin", func(t *testing.T) {
		payload := SigninPayload{
			Email:    "signin@example.com",
			Password: "password",
		}

		body, _ := json.Marshal(payload)
		req := httptest.NewRequest(http.MethodPost, "/signin", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := service.PostSignIn(c)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if rec.Code != http.StatusOK {
			t.Fatalf("Expected status 200, got %d", rec.Code)
		}

		var response Tokens
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		if err != nil {
			t.Fatalf("Failed to unmarshal response: %v", err)
		}

		if response.AccessToken == "" || response.RefreshToken == "" {
			t.Fatal("Response should contain access and refresh tokens")
		}
	})

	t.Run("invalid credentials", func(t *testing.T) {
		payload := SigninPayload{
			Email:    "signin@example.com",
			Password: "wrongpassword",
		}

		body, _ := json.Marshal(payload)
		req := httptest.NewRequest(http.MethodPost, "/signin", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := service.PostSignIn(c)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if rec.Code != http.StatusBadRequest {
			t.Fatalf("Expected status 400, got %d", rec.Code)
		}
	})

	t.Run("user not found", func(t *testing.T) {
		payload := SigninPayload{
			Email:    "notfound@example.com",
			Password: "password",
		}

		body, _ := json.Marshal(payload)
		req := httptest.NewRequest(http.MethodPost, "/signin", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := service.PostSignIn(c)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if rec.Code != http.StatusNotFound {
			t.Fatalf("Expected status 404, got %d", rec.Code)
		}
	})
}

func TestPostForgotPassword(t *testing.T) {
	service, _ := setupTestService(t)
	e := echo.New()

	user := &models.User{
		Email:    "forgot@example.com",
		Name:     "Forgot User",
		Password: "hashedpassword",
		IsActive: true,
	}
	service.Database.Connection().Create(user)

	t.Run("successful forgot password", func(t *testing.T) {
		payload := ForgotPasswordRequest{
			Email: "forgot@example.com",
		}

		body, _ := json.Marshal(payload)
		req := httptest.NewRequest(http.MethodPost, "/forgot-password", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := service.PostForgotPassword(c)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if rec.Code != http.StatusOK {
			t.Fatalf("Expected status 200, got %d", rec.Code)
		}

		var updatedUser models.User
		service.Database.Connection().Where("email = ?", payload.Email).First(&updatedUser)
		if updatedUser.PasswordResetToken == "" {
			t.Fatal("Password reset token should be set")
		}

		if updatedUser.PasswordResetExpiresAt.Before(time.Now()) {
			t.Fatal("Password reset expiration should be in the future")
		}
	})

	t.Run("user not found - still returns success", func(t *testing.T) {
		payload := ForgotPasswordRequest{
			Email: "notfound@example.com",
		}

		body, _ := json.Marshal(payload)
		req := httptest.NewRequest(http.MethodPost, "/forgot-password", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := service.PostForgotPassword(c)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if rec.Code != http.StatusOK {
			t.Fatalf("Expected status 200, got %d", rec.Code)
		}
	})
}

func TestPostResetPassword(t *testing.T) {
	service, _ := setupTestService(t)
	e := echo.New()

	resetToken := "valid-reset-token"
	user := &models.User{
		Email:                  "reset@example.com",
		Name:                   "Reset User",
		Password:               "oldpassword",
		PasswordResetToken:     resetToken,
		PasswordResetExpiresAt: time.Now().Add(time.Hour),
		IsActive:               true,
	}
	service.Database.Connection().Create(user)

	t.Run("successful password reset", func(t *testing.T) {
		payload := ResetPasswordRequest{
			Token:       resetToken,
			NewPassword: "newpassword123",
		}

		body, _ := json.Marshal(payload)
		req := httptest.NewRequest(http.MethodPost, "/reset-password", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := service.PostResetPassword(c)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if rec.Code != http.StatusOK {
			t.Fatalf("Expected status 200, got %d", rec.Code)
		}

		var updatedUser models.User
		service.Database.Connection().Where("email = ?", user.Email).First(&updatedUser)
		if updatedUser.Password == "oldpassword" {
			t.Fatal("Password should have been changed")
		}
		if updatedUser.PasswordResetToken != "" {
			t.Fatal("Reset token should have been cleared")
		}
	})

	t.Run("invalid token", func(t *testing.T) {
		payload := ResetPasswordRequest{
			Token:       "invalid-token",
			NewPassword: "newpassword123",
		}

		body, _ := json.Marshal(payload)
		req := httptest.NewRequest(http.MethodPost, "/reset-password", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := service.PostResetPassword(c)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if rec.Code != http.StatusBadRequest {
			t.Fatalf("Expected status 400, got %d", rec.Code)
		}
	})

	t.Run("expired token", func(t *testing.T) {
		expiredToken := "expired-token"
		expiredUser := &models.User{
			Email:                  "expired@example.com",
			Name:                   "Expired User",
			Password:               "oldpassword",
			PasswordResetToken:     expiredToken,
			PasswordResetExpiresAt: time.Now().Add(-time.Hour), // Expired
			IsActive:               true,
		}
		service.Database.Connection().Create(expiredUser)

		payload := ResetPasswordRequest{
			Token:       expiredToken,
			NewPassword: "newpassword123",
		}

		body, _ := json.Marshal(payload)
		req := httptest.NewRequest(http.MethodPost, "/reset-password", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := service.PostResetPassword(c)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if rec.Code != http.StatusBadRequest {
			t.Fatalf("Expected status 400, got %d", rec.Code)
		}
	})
}