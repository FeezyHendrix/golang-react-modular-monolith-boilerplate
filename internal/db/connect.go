package db

import (
	"fmt"

	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	connInfo = "user=%s password=%s host=%s port=%s dbname=%s connect_timeout=%d sslmode=%s search_path=%s"
)

func Connect(cfg *Config, deps *Dependencies) (*DB, error) {
	dsn := fmt.Sprintf(connInfo, cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Database, cfg.ConnectTimeout, cfg.SSLMode, cfg.Schema)

	conn, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database at %s:%s/%s: %w", cfg.Host, cfg.Port, cfg.Database, err)
	}

	
	sqlDB, err := conn.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get database instance: %w", err)
	}
	
	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("database ping failed - database may be unreachable: %w", err)
	}

	deps.Logger.Info("Successfully connected to database", 
		zap.String("host", cfg.Host), 
		zap.String("database", cfg.Database),
	)

	return &DB{
		Conn: conn,
	}, nil
}
