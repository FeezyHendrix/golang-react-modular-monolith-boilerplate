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
	envconfig.MustProcess("", cfg)

	lgr, err := initLogger(cfg)
	if err != nil {
		log.Fatal("failed to initialize logger", err)
	}

	dbConn, err := db.Connect(cfg.DBConfig, &db.Dependencies{
		Logger: lgr,
	})

	dbConn.MigrateAllFields()

	if err != nil {
		lgr.Fatal("failed to connect to database", zap.Error(err))
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

	lgr.Info("server started")
	err = apiServer.ListenAndServe()
	if err != nil && !errors.Is(err, http.ErrServerClosed) {
		lgr.Error("failed to start server", zap.Error(err))
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
