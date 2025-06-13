package authentication

import (
	"net/http"
	"time"

	"github.com/feezyhendrix/echoboilerplate/internal/common/logger"
	"github.com/feezyhendrix/echoboilerplate/internal/common/passwords"
	"github.com/feezyhendrix/echoboilerplate/internal/models"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type ResetPasswordRequest struct {
	Token       string `json:"token" validate:"required"`
	NewPassword string `json:"newPassword" validate:"required,min=8"`
}

func (s *service) PostResetPassword(c echo.Context) error {
	req := c.Request()
	payload := &ResetPasswordRequest{}

	ctx := req.Context()
	lgr := logger.ContextLogger(ctx, s.Logger)

	if err := c.Bind(payload); err != nil {
		lgr.Error("failed to bind request", zap.Error(err))
		return c.NoContent(http.StatusBadRequest)
	}

	// Find user by reset token
	var user models.User
	err := s.Database.Conn.Where("password_reset_token = ? AND password_reset_expires_at > ?", 
		payload.Token, time.Now()).First(&user).Error
	
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid or expired reset token"})
		}
		lgr.Error("failed to find user by reset token", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	// Hash new password
	hashedPassword, err := passwords.GenerateHashFromPassword(payload.NewPassword)
	if err != nil {
		lgr.Error("failed to hash new password", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	// Update user password and clear reset token
	user.Password = string(hashedPassword)
	user.PasswordResetToken = ""
	user.PasswordResetExpiresAt = time.Time{}

	if err := s.Users.UpdateUser(ctx, &user); err != nil {
		lgr.Error("failed to update user password", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	lgr.Info("password reset successful", zap.Uint("userId", user.ID))
	return c.JSON(http.StatusOK, map[string]string{"message": "Password reset successful"})
}