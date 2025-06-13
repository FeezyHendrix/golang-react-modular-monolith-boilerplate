package db

import (
	"fmt"
	"log"

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
		panic("Failed to connect to database")
	}

	
	sqlDB, err := conn.DB()
	if err != nil {
		log.Fatal("Failed to get generic database object")
	} else {
		log.Println("Successfully connected to the database")
	}
	
	if err := sqlDB.Ping(); err != nil {
		log.Fatal("Database ping failed:", err)
	}

	return &DB{
		Conn: conn,
	}, err
}
