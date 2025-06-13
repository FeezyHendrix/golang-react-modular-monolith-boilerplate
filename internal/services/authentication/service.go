package authentication

import (
	"encoding/hex"

	"github.com/feezyhendrix/echoboilerplate/internal/db"
	"github.com/feezyhendrix/echoboilerplate/internal/services/email"
	"github.com/feezyhendrix/echoboilerplate/internal/services/users"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

type Config struct {
	JWTSecret                  string `envconfig:"AUTHENTICATION_JWT_SECRET" required:"true"`
	AccessTokenTTLSecs         int    `envconfig:"AUTHENTICATION_ACCESS_TOKEN_TTL_SEC" default:"900"`            // 15 minutes default
	RefreshTokenTTLSecs        int    `envconfig:"AUTHENTICATION_REFRESH_TOKEN_TTL_SEC" default:"86400"`         // 24 hours default
	PasswordResetTokenTTLSecs  int64  `envconfig:"AUTHENTICATION__PASSWORD_RESET_TOKEN_TTL_SECS" default:"3600"` // 1 hour default
	PasswordResetEncryptionKey string `envconfig:"AUTHENTICATION__PASSWORD_RESET_TOKEN_ENCRYPTION_KEY" required:"true"`
	PasswordResetURL           string `envconfig:"AUTHENTICATION__PASSWORD_RESET_URL" required:"true"`
}

type Dependencies struct {
	Validate *validator.Validate
	Logger   *zap.Logger
	Database db.DB
	Users    users.Service
	Email    email.Service
}

type service struct {
	*Config
	*Dependencies
}

type Service interface {
	AuthenticationMiddleware() echo.MiddlewareFunc
	PostSignIn(c echo.Context) error
	PostSignUp(c echo.Context) error
	PostSignOut(c echo.Context) error
	PostRefreshToken(c echo.Context) error
	PostForgotPassword(c echo.Context) error
	PostResetPassword(c echo.Context) error
	PostEnable2FA(c echo.Context) error
	PostDisable2FA(c echo.Context) error
	PostVerify2FA(c echo.Context) error
}

func New(cfg *Config, deps *Dependencies) Service {
	key := []byte(cfg.PasswordResetEncryptionKey)
	cfg.PasswordResetEncryptionKey = hex.EncodeToString(key)

	return &service{
		cfg,
		deps,
	}
}
