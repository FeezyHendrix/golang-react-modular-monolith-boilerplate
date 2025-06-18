package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"

	"github.com/feezyhendrix/echoboilerplate/internal/api"
	environment "github.com/feezyhendrix/echoboilerplate/internal/common/environment"
	"github.com/feezyhendrix/echoboilerplate/internal/db"
	"github.com/feezyhendrix/echoboilerplate/internal/services/authentication"
	"github.com/feezyhendrix/echoboilerplate/internal/services/email"
	"github.com/feezyhendrix/echoboilerplate/internal/services/permissions"
	"github.com/feezyhendrix/echoboilerplate/internal/services/users"
	"github.com/feezyhendrix/echoboilerplate/internal/common/validator"
	"github.com/kelseyhightower/envconfig"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var Version = "1.0.0"

type Config struct {
	APIConfig            *api.Config
	DBConfig             *db.Config
	AuthenticationConfig *authentication.Config
	EmailConfig          *email.Config
	UserConfig           *users.Config
	LogLevel             string                      `envconfig:"LOG_LEVEL" default:"error"`
	Environment          environment.EnvironmentType `envconfig:"ENVIRONMENT" default:"production"`
}

func main() {
	cfg := &Config{}
	if err := envconfig.Process("", cfg); err != nil {
		log.Fatalf("Failed to load configuration: %v\n\nPlease ensure all required environment variables are set:\n%s", err, getRequiredEnvVars())
	}

	lgr, err := initLogger(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v\n\nPlease check your LOG_LEVEL environment variable. Valid values are: debug, info, warn, error, dpanic, panic, fatal", err)
	}

	dbConn, err := db.Connect(cfg.DBConfig, &db.Dependencies{
		Logger: lgr,
	})
	if err != nil {
		lgr.Fatal("Failed to connect to database. Please check your database configuration and ensure PostgreSQL is running.", 
			zap.Error(err),
			zap.String("host", cfg.DBConfig.Host),
			zap.String("port", cfg.DBConfig.Port),
			zap.String("database", cfg.DBConfig.Database),
			zap.String("user", cfg.DBConfig.User),
		)
	}

	err = dbConn.MigrateAllFields()
	if err != nil {
		lgr.Fatal("Failed to run database migrations", zap.Error(err))
	}

	valdtr := validator.NewValidator()

	userSvc := users.New(cfg.UserConfig, &users.Dependencies{
		Database: *dbConn,
		Logger:   lgr,
	})

	emailSvc := email.New(cfg.EmailConfig, &email.Dependencies{
		Logger: lgr,
	})

	authSvc := authentication.New(cfg.AuthenticationConfig, &authentication.Dependencies{
		Logger:   lgr,
		Validate: valdtr.Validator,
		Database: *dbConn,
		Users:    userSvc,
		Email:    emailSvc,
	})

	permissionsSvc := permissions.NewService(dbConn.Conn)
	
	err = permissionsSvc.SeedDefaultData()
	if err != nil {
		lgr.Warn("failed to seed default permissions data", zap.Error(err))
	}

	deps := &api.Dependencies{
		Logger:            lgr,
		Database:          *dbConn,
		AuthenticationSvc: authSvc,
		UsersSvc:          userSvc,
		PermissionsSvc:    permissionsSvc,
	}

	a := api.New(cfg.APIConfig, deps)
	chn := make(chan os.Signal, 1)
	signal.Notify(chn, os.Interrupt)

	apiServer := &http.Server{
		Addr:    ":" + cfg.APIConfig.Port,
		Handler: a.HTTPHandler(),
	}

	go func() {
		sig := <-chn
		lgr.Info("shutting down server", zap.String("os signal", sig.String()))
		err := apiServer.Shutdown(context.Background())
		if err != nil {
			lgr.Error("error occurred during shutdown: ", zap.Error(err))
		}
	}()

	lgr.Info("Server starting", zap.String("port", cfg.APIConfig.Port), zap.String("environment", string(cfg.Environment)))
	err = apiServer.ListenAndServe()
	if err != nil && !errors.Is(err, http.ErrServerClosed) {
		lgr.Error("Failed to start server. Please check if the port is already in use or if you have permission to bind to this port.", 
			zap.Error(err),
			zap.String("port", cfg.APIConfig.Port),
		)
	}
}

func initLogger(cfg *Config) (*zap.Logger, error) {
	lgLvl, err := zapcore.ParseLevel(cfg.LogLevel)
	if err != nil {
		return nil, err
	}

	var zcfg zap.Config

	if cfg.Environment == environment.Production || cfg.Environment == environment.QA {
		zcfg = zap.NewProductionConfig()
	} else {
		zcfg = zap.NewDevelopmentConfig()
	}

	zcfg.Level = zap.NewAtomicLevelAt(lgLvl)
	zcfg.EncoderConfig.TimeKey = zapcore.OmitKey

	zcfg.InitialFields = map[string]interface{}{
		"version": Version,
	}

	return zcfg.Build()
}

func getRequiredEnvVars() string {
	return `
Required Environment Variables:
=============================

Database Configuration:
- POSTGRES_USER: PostgreSQL username
- POSTGRES_HOST: PostgreSQL host (e.g., localhost)
- POSTGRES_PASSWORD: PostgreSQL password
- POSTGRES_PORT: PostgreSQL port (e.g., 5432)
- POSTGRES_DB: Database name
- POSTGRES_CONNECT_TIMEOUT: Connection timeout in seconds
- POSTGRES_SSL_MODE: SSL mode (e.g., disable, require)
- POSTGRES_DB_SCHEMA: Database schema (e.g., public)

API Configuration:
- PORT: Server port number (e.g., 8080)

Authentication Configuration:
- AUTHENTICATION_JWT_SECRET: JWT signing secret (should be a long, random string)
- AUTHENTICATION__PASSWORD_RESET_TOKEN_ENCRYPTION_KEY: Encryption key for password reset tokens
- AUTHENTICATION__PASSWORD_RESET_URL: URL for password reset page

Email Configuration:
- RESEND_API_KEY: API key for Resend email service

Example environment file (server.env):
PORT=8080
POSTGRES_USER=postgres
POSTGRES_HOST=localhost
POSTGRES_PASSWORD=your_password
POSTGRES_PORT=5432
POSTGRES_DB=your_database
POSTGRES_CONNECT_TIMEOUT=10
POSTGRES_SSL_MODE=disable
POSTGRES_DB_SCHEMA=public
AUTHENTICATION_JWT_SECRET=your_jwt_secret_here
AUTHENTICATION__PASSWORD_RESET_TOKEN_ENCRYPTION_KEY=your_encryption_key_here
AUTHENTICATION__PASSWORD_RESET_URL=http://localhost:3000/reset-password
RESEND_API_KEY=your_resend_api_key_here
`
}
