package authentication

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"time"

	"github.com/feezyhendrix/echoboilerplate/internal/common/logger"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"required,email"`
}

func (s *service) PostForgotPassword(c echo.Context) error {
	req := c.Request()
	payload := &ForgotPasswordRequest{}

	ctx := req.Context()
	lgr := logger.ContextLogger(ctx, s.Logger)

	if err := c.Bind(payload); err != nil {
		lgr.Error("failed to bind request", zap.Error(err))
		return c.NoContent(http.StatusBadRequest)
	}

	// Get user by email
	user, err := s.Users.GetUserByEmail(ctx, payload.Email)
	if err != nil {
		lgr.Error("failed to get user by email", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	// Even if user doesn't exist, return success to prevent email enumeration
	if user == nil {
		return c.JSON(http.StatusOK, map[string]string{"message": "If the email exists, a reset link has been sent"})
	}

	// Generate reset token
	resetToken, err := generateResetToken()
	if err != nil {
		lgr.Error("failed to generate reset token", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	// Update user with reset token and expiration
	user.PasswordResetToken = resetToken
	user.PasswordResetExpiresAt = time.Now().Add(time.Hour) // 1 hour expiration

	if err := s.Users.UpdateUser(ctx, user); err != nil {
		lgr.Error("failed to update user with reset token", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	// Send password reset email
	if err := s.Email.SendPasswordResetEmail(ctx, user.Email, user.Name, resetToken); err != nil {
		lgr.Error("failed to send password reset email", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "If the email exists, a reset link has been sent"})
}

func generateResetToken() (string, error) {
	bytes := make([]byte, 32)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}