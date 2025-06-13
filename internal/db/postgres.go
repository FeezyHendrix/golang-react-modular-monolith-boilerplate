package db

import (
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type Config struct {
	User           string `envconfig:"POSTGRES_USER" required:"true"`
	Host           string `envconfig:"POSTGRES_HOST" required:"true"`
	Password       string `envconfig:"POSTGRES_PASSWORD" required:"true"`
	Port           string `envconfig:"POSTGRES_PORT" required:"true"`
	Database       string `envconfig:"POSTGRES_DB" required:"true"`
	ConnectTimeout int32  `envconfig:"POSTGRES_CONNECT_TIMEOUT" required:"true"`
	SSLMode        string `envconfig:"POSTGRES_SSL_MODE" required:"true"`
	Schema         string `envconfig:"POSTGRES_DB_SCHEMA" required:"true"`
}

type Dependencies struct {
	Logger *zap.Logger
}

type DB struct {
	Conn   *gorm.DB
	Config *gorm.Config
}
