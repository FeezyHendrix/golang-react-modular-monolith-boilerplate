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


	if user.TwoFactorEnabled {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "2FA is already enabled"})
	}

	secret := generateTOTPSecret()
	
	backupCodes := generateBackupCodes(10)
	backupCodesStr := strings.Join(backupCodes, ",")

	if err := s.Users.UpdateUser2FA(ctx, userID, true, secret); err != nil {
		lgr.Error("failed to enable 2FA for user", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	user.TwoFactorBackupCodes = backupCodesStr
	if err := s.Users.UpdateUser(ctx, user); err != nil {
		lgr.Error("failed to update backup codes", zap.Error(err))
	}

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

	if !verifyTOTPCode(user.TwoFactorSecret, payload.Code) {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid 2FA code"})
	}

	if err := s.Users.UpdateUser2FA(ctx, userID, false, ""); err != nil {
		lgr.Error("failed to disable 2FA for user", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

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

	valid := verifyTOTPCode(user.TwoFactorSecret, payload.Code)
	
	if !valid {
		backupCodes := strings.Split(user.TwoFactorBackupCodes, ",")
		for i, code := range backupCodes {
			if code == payload.Code {
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

	jwt, err := s.generateTokens(&TokenContext{UserID: float64(user.ID)})
	if err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}

	return c.JSON(http.StatusOK, jwt)
}

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
	if len(code) != 6 {
		return false
	}
	
	_, err := strconv.Atoi(code)
	return err == nil
}

func getUserIDFromContext(c echo.Context) (uint, error) {
	claims := c.Get("user")
	if claims == nil {
		return 0, fmt.Errorf("no user in context")
	}
	
	return 1, nil
}