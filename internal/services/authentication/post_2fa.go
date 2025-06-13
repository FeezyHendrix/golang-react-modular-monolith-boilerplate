package authentication

import (
	"crypto/rand"
	"encoding/base32"
	"fmt"
	"math/big"
	"net/http"
	"strconv"
	"strings"

	"github.com/feezyhendrix/echoboilerplate/internal/common/logger"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

type Enable2FARequest struct {
	Password string `json:"password" validate:"required"`
}

type Disable2FARequest struct {
	Password string `json:"password" validate:"required"`
	Code     string `json:"code" validate:"required"`
}

type Verify2FARequest struct {
	Email string `json:"email" validate:"required,email"`
	Code  string `json:"code" validate:"required"`
}

type Enable2FAResponse struct {
	Secret      string   `json:"secret"`
	QRCodeURL   string   `json:"qrCodeUrl"`
	BackupCodes []string `json:"backupCodes"`
}

func (s *service) PostEnable2FA(c echo.Context) error {
	req := c.Request()
	payload := &Enable2FARequest{}

	ctx := req.Context()
	lgr := logger.ContextLogger(ctx, s.Logger)

	if err := c.Bind(payload); err != nil {
		lgr.Error("failed to bind request", zap.Error(err))
		return c.NoContent(http.StatusBadRequest)
	}

	// Get user from context (assume middleware sets this)
	userID, err := getUserIDFromContext(c)
	if err != nil {
		return c.NoContent(http.StatusUnauthorized)
	}

	user, err := s.Users.GetUserByID(ctx, userID)
	if err != nil || user == nil {
		lgr.Error("failed to get user", zap.Error(err))
		return c.NoContent(http.StatusNotFound)
	}

	// Verify password
	// match, err := passwords.HashAndPasswordMatch(user.Password, payload.Password)
	// if err != nil || !match {
	// 	return c.NoContent(http.StatusUnauthorized)
	// }

	if user.TwoFactorEnabled {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "2FA is already enabled"})
	}

	// Generate secret
	secret := generateTOTPSecret()
	
	// Generate backup codes
	backupCodes := generateBackupCodes(10)
	backupCodesStr := strings.Join(backupCodes, ",")

	// Update user
	if err := s.Users.UpdateUser2FA(ctx, userID, true, secret); err != nil {
		lgr.Error("failed to enable 2FA for user", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	// Update backup codes
	user.TwoFactorBackupCodes = backupCodesStr
	if err := s.Users.UpdateUser(ctx, user); err != nil {
		lgr.Error("failed to update backup codes", zap.Error(err))
	}

	// Generate QR code URL
	qrCodeURL := generateQRCodeURL(user.Email, secret)

	response := &Enable2FAResponse{
		Secret:      secret,
		QRCodeURL:   qrCodeURL,
		BackupCodes: backupCodes,
	}

	return c.JSON(http.StatusOK, response)
}

func (s *service) PostDisable2FA(c echo.Context) error {
	req := c.Request()
	payload := &Disable2FARequest{}

	ctx := req.Context()
	lgr := logger.ContextLogger(ctx, s.Logger)

	if err := c.Bind(payload); err != nil {
		lgr.Error("failed to bind request", zap.Error(err))
		return c.NoContent(http.StatusBadRequest)
	}

	// Get user from context
	userID, err := getUserIDFromContext(c)
	if err != nil {
		return c.NoContent(http.StatusUnauthorized)
	}

	user, err := s.Users.GetUserByID(ctx, userID)
	if err != nil || user == nil {
		lgr.Error("failed to get user", zap.Error(err))
		return c.NoContent(http.StatusNotFound)
	}

	if !user.TwoFactorEnabled {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "2FA is not enabled"})
	}

	// Verify 2FA code
	if !verifyTOTPCode(user.TwoFactorSecret, payload.Code) {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid 2FA code"})
	}

	// Disable 2FA
	if err := s.Users.UpdateUser2FA(ctx, userID, false, ""); err != nil {
		lgr.Error("failed to disable 2FA for user", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	// Clear backup codes
	user.TwoFactorBackupCodes = ""
	if err := s.Users.UpdateUser(ctx, user); err != nil {
		lgr.Error("failed to clear backup codes", zap.Error(err))
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "2FA disabled successfully"})
}

func (s *service) PostVerify2FA(c echo.Context) error {
	req := c.Request()
	payload := &Verify2FARequest{}

	ctx := req.Context()
	lgr := logger.ContextLogger(ctx, s.Logger)

	if err := c.Bind(payload); err != nil {
		lgr.Error("failed to bind request", zap.Error(err))
		return c.NoContent(http.StatusBadRequest)
	}

	user, err := s.Users.GetUserByEmail(ctx, payload.Email)
	if err != nil || user == nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid credentials"})
	}

	if !user.TwoFactorEnabled {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "2FA is not enabled"})
	}

	// Verify TOTP code or backup code
	valid := verifyTOTPCode(user.TwoFactorSecret, payload.Code)
	
	if !valid {
		// Check if it's a backup code
		backupCodes := strings.Split(user.TwoFactorBackupCodes, ",")
		for i, code := range backupCodes {
			if code == payload.Code {
				// Remove used backup code
				backupCodes = append(backupCodes[:i], backupCodes[i+1:]...)
				user.TwoFactorBackupCodes = strings.Join(backupCodes, ",")
				s.Users.UpdateUser(ctx, user)
				valid = true
				break
			}
		}
	}

	if !valid {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid 2FA code"})
	}

	// Generate JWT tokens
	jwt, err := s.generateTokens(&TokenContext{UserID: float64(user.ID)})
	if err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}

	return c.JSON(http.StatusOK, jwt)
}

// Helper functions
func generateTOTPSecret() string {
	bytes := make([]byte, 20)
	rand.Read(bytes)
	return base32.StdEncoding.EncodeToString(bytes)
}

func generateBackupCodes(count int) []string {
	codes := make([]string, count)
	for i := 0; i < count; i++ {
		code, _ := rand.Int(rand.Reader, big.NewInt(100000000))
		codes[i] = fmt.Sprintf("%08d", code.Int64())
	}
	return codes
}

func generateQRCodeURL(email, secret string) string {
	return fmt.Sprintf("otpauth://totp/Echo%%20Boilerplate:%s?secret=%s&issuer=Echo%%20Boilerplate", 
		email, secret)
}

func verifyTOTPCode(secret, code string) bool {
	// Simple TOTP verification - in production, use a proper TOTP library
	// This is a simplified implementation for demonstration
	if len(code) != 6 {
		return false
	}
	
	// For demo purposes, accept any 6-digit code
	_, err := strconv.Atoi(code)
	return err == nil
}

func getUserIDFromContext(c echo.Context) (uint, error) {
	// This should extract user ID from JWT token in the context
	// For now, return a placeholder implementation
	claims := c.Get("user")
	if claims == nil {
		return 0, fmt.Errorf("no user in context")
	}
	
	// Extract user ID from claims - this depends on your JWT implementation
	// For now, return a dummy value
	return 1, nil
}