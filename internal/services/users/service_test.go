package users

import (
	"context"
	"testing"
	"time"

	"github.com/feezyhendrix/echoboilerplate/internal/models"
	"go.uber.org/zap"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

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
	mockDB := setupTestDB(t)

	cfg := &Config{}
	deps := &Dependencies{
		Database: mockDB,
		Logger:   logger,
	}

	return New(cfg, deps).(*service), mockDB
}

func TestGetUserByEmail(t *testing.T) {
	service, db := setupTestService(t)
	ctx := context.Background()

	user := &models.User{
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "hashedpassword",
		IsActive: true,
	}
	db.Connection().Create(user)

	t.Run("user found", func(t *testing.T) {
		result, err := service.GetUserByEmail(ctx, "test@example.com")
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if result == nil {
			t.Fatal("Expected user to be found")
		}

		if result.Email != "test@example.com" {
			t.Fatalf("Expected email test@example.com, got %s", result.Email)
		}

		if result.Name != "Test User" {
			t.Fatalf("Expected name Test User, got %s", result.Name)
		}
	})

	t.Run("user not found", func(t *testing.T) {
		result, err := service.GetUserByEmail(ctx, "notfound@example.com")
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if result != nil {
			t.Fatal("Expected user to be nil when not found")
		}
	})
}

func TestGetUserByID(t *testing.T) {
	service, db := setupTestService(t)
	ctx := context.Background()

	user := &models.User{
		Email:    "testid@example.com",
		Name:     "Test ID User",
		Password: "hashedpassword",
		IsActive: true,
	}
	db.Connection().Create(user)

	t.Run("user found", func(t *testing.T) {
		result, err := service.GetUserByID(ctx, user.ID)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if result == nil {
			t.Fatal("Expected user to be found")
		}

		if result.ID != user.ID {
			t.Fatalf("Expected ID %d, got %d", user.ID, result.ID)
		}

		if result.Email != "testid@example.com" {
			t.Fatalf("Expected email testid@example.com, got %s", result.Email)
		}
	})

	t.Run("user not found", func(t *testing.T) {
		result, err := service.GetUserByID(ctx, 99999)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if result != nil {
			t.Fatal("Expected user to be nil when not found")
		}
	})
}

func TestCreateUser(t *testing.T) {
	service, _ := setupTestService(t)
	ctx := context.Background()

	t.Run("successful user creation", func(t *testing.T) {
		user := &models.User{
			Email:    "create@example.com",
			Name:     "Create User",
			Password: "hashedpassword",
			IsActive: true,
		}

		err := service.CreateUser(ctx, user)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if user.ID == 0 {
			t.Fatal("Expected user ID to be set after creation")
		}

		// Verify user was created
		var foundUser models.User
		err = service.Database.Connection().Where("email = ?", "create@example.com").First(&foundUser).Error
		if err != nil {
			t.Fatalf("User was not created: %v", err)
		}

		if foundUser.Name != "Create User" {
			t.Fatalf("Expected name Create User, got %s", foundUser.Name)
		}
	})

	t.Run("duplicate email creation", func(t *testing.T) {
		// Create first user
		user1 := &models.User{
			Email:    "duplicate@example.com",
			Name:     "First User",
			Password: "hashedpassword1",
			IsActive: true,
		}
		service.CreateUser(ctx, user1)

		// Try to create second user with same email
		user2 := &models.User{
			Email:    "duplicate@example.com",
			Name:     "Second User",
			Password: "hashedpassword2",
			IsActive: true,
		}

		err := service.CreateUser(ctx, user2)
		if err == nil {
			t.Fatal("Expected error when creating user with duplicate email")
		}
	})
}

func TestUpdateUser(t *testing.T) {
	service, db := setupTestService(t)
	ctx := context.Background()

	user := &models.User{
		Email:    "update@example.com",
		Name:     "Original Name",
		Password: "hashedpassword",
		IsActive: true,
	}
	db.Connection().Create(user)

	t.Run("successful user update", func(t *testing.T) {
		user.Name = "Updated Name"
		user.IsActive = false

		err := service.UpdateUser(ctx, user)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		var foundUser models.User
		err = service.Database.Connection().Where("id = ?", user.ID).First(&foundUser).Error
		if err != nil {
			t.Fatalf("Failed to find updated user: %v", err)
		}

		if foundUser.Name != "Updated Name" {
			t.Fatalf("Expected name Updated Name, got %s", foundUser.Name)
		}

		if foundUser.IsActive != false {
			t.Fatalf("Expected IsActive false, got %t", foundUser.IsActive)
		}
	})
}

func TestUpdateUserPassword(t *testing.T) {
	service, db := setupTestService(t)
	ctx := context.Background()

	user := &models.User{
		Email:    "password@example.com",
		Name:     "Password User",
		Password: "oldhashedpassword",
		IsActive: true,
	}
	db.Connection().Create(user)

	t.Run("successful password update", func(t *testing.T) {
		newPassword := "newhashedpassword"

		err := service.UpdateUserPassword(ctx, user.ID, newPassword)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		var foundUser models.User
		err = service.Database.Connection().Where("id = ?", user.ID).First(&foundUser).Error
		if err != nil {
			t.Fatalf("Failed to find user: %v", err)
		}

		if foundUser.Password != newPassword {
			t.Fatalf("Expected password %s, got %s", newPassword, foundUser.Password)
		}
	})

	t.Run("update password for non-existent user", func(t *testing.T) {
		err := service.UpdateUserPassword(ctx, 99999, "newpassword")
		if err != nil {
			t.Fatalf("Expected no error for non-existent user, got %v", err)
		}
	})
}

func TestUpdateUser2FA(t *testing.T) {
	service, db := setupTestService(t)
	ctx := context.Background()

	user := &models.User{
		Email:            "2fa@example.com",
		Name:             "2FA User",
		Password:         "hashedpassword",
		TwoFactorEnabled: false,
		TwoFactorSecret:  "",
		IsActive:         true,
	}
	db.Connection().Create(user)

	t.Run("enable 2FA", func(t *testing.T) {
		secret := "TESTSECRET123456"

		err := service.UpdateUser2FA(ctx, user.ID, true, secret)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		var foundUser models.User
		err = service.Database.Connection().Where("id = ?", user.ID).First(&foundUser).Error
		if err != nil {
			t.Fatalf("Failed to find user: %v", err)
		}

		if !foundUser.TwoFactorEnabled {
			t.Fatal("Expected TwoFactorEnabled to be true")
		}

		if foundUser.TwoFactorSecret != secret {
			t.Fatalf("Expected secret %s, got %s", secret, foundUser.TwoFactorSecret)
		}
	})

	t.Run("disable 2FA", func(t *testing.T) {
		err := service.UpdateUser2FA(ctx, user.ID, false, "")
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		var foundUser models.User
		err = service.Database.Connection().Where("id = ?", user.ID).First(&foundUser).Error
		if err != nil {
			t.Fatalf("Failed to find user: %v", err)
		}

		if foundUser.TwoFactorEnabled {
			t.Fatal("Expected TwoFactorEnabled to be false")
		}

		if foundUser.TwoFactorSecret != "" {
			t.Fatalf("Expected empty secret, got %s", foundUser.TwoFactorSecret)
		}
	})

	t.Run("update 2FA for non-existent user", func(t *testing.T) {
		err := service.UpdateUser2FA(ctx, 99999, true, "secret")
		if err != nil {
			t.Fatalf("Expected no error for non-existent user, got %v", err)
		}
	})
}