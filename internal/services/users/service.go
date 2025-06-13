package users

import (
	"context"
	"net/http"

	"github.com/feezyhendrix/echoboilerplate/internal/db"
	"github.com/feezyhendrix/echoboilerplate/internal/models"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type Config struct{}

type Dependencies struct {
	Database db.DB
	Logger   *zap.Logger
}

type service struct {
	*Config
	*Dependencies
}

type Service interface {
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
	GetUserByID(ctx context.Context, id uint) (*models.User, error)
	CreateUser(ctx context.Context, user *models.User) error
	UpdateUser(ctx context.Context, user *models.User) error
	UpdateUserPassword(ctx context.Context, userID uint, hashedPassword string) error
	UpdateUser2FA(ctx context.Context, userID uint, enabled bool, secret string) error
	GetUserProfile(ctx echo.Context) error
}

func New(cfg *Config, deps *Dependencies) Service {
	return &service{
		cfg,
		deps,
	}
}

func (s *service) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	err := s.Database.Conn.Where("email = ?", email).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (s *service) GetUserByID(ctx context.Context, id uint) (*models.User, error) {
	var user models.User
	err := s.Database.Conn.Where("id = ?", id).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (s *service) CreateUser(ctx context.Context, user *models.User) error {
	return s.Database.Conn.Create(user).Error
}

func (s *service) UpdateUser(ctx context.Context, user *models.User) error {
	return s.Database.Conn.Save(user).Error
}

func (s *service) UpdateUserPassword(ctx context.Context, userID uint, hashedPassword string) error {
	return s.Database.Conn.Model(&models.User{}).Where("id = ?", userID).Update("password", hashedPassword).Error
}

func (s *service) UpdateUser2FA(ctx context.Context, userID uint, enabled bool, secret string) error {
	return s.Database.Conn.Model(&models.User{}).Where("id = ?", userID).Updates(map[string]interface{}{
		"two_factor_enabled": enabled,
		"two_factor_secret":  secret,
	}).Error
}

func (s *service) GetUserProfile(c echo.Context) error {
	user, ok := c.Get("user").(*models.User)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "User not authenticated")
	}

	// Load user with roles and permissions
	var fullUser models.User
	err := s.Database.Conn.Preload("UserRoles.Role.Permissions.Permission").First(&fullUser, user.ID).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return echo.NewHTTPError(http.StatusNotFound, "User not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get user profile")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"user": fullUser,
	})
}