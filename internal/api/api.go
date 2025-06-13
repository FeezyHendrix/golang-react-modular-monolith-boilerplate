package api

import (
	"net/http"

	"github.com/feezyhendrix/echoboilerplate/internal/db"
	"github.com/feezyhendrix/echoboilerplate/internal/services/authentication"
	"github.com/feezyhendrix/echoboilerplate/internal/services/permissions"
	"github.com/feezyhendrix/echoboilerplate/internal/services/users"
	"go.uber.org/zap"
)

type Config struct {
	StaticDir      string `envconfig:"STATIC_DIR" default:"/html" required:"true"`
	Port           string `envconfig:"PORT" required:"true"`
	SwaggerEnabled bool   `envconfig:"SWAGGER_ENABLED" default:"false"`
	APIServerHost  string `envconfig:"API_SERVER_HOST" default:""`
}

type Dependencies struct {
	*zap.Logger
	Database          db.DB
	AuthenticationSvc authentication.Service
	UsersSvc          users.Service
	PermissionsSvc    *permissions.Service
}

type api struct {
	*Config
	*Dependencies
	http.Handler
	permissionsService *permissions.Service
}

type API interface {
	HTTPHandler() http.Handler
}

func New(cfg *Config, deps *Dependencies) API {
	return &api{
		Config:             cfg,
		Dependencies:       deps,
		permissionsService: deps.PermissionsSvc,
	}
}

func (a *api) HTTPHandler() http.Handler {
	if a.Handler == nil {
		a.Handler = a.configureRoutes()
	}
	return a.Handler
}
