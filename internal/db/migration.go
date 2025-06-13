package db

import (
	"github.com/feezyhendrix/echoboilerplate/internal/models"
)

func (db *DB) MigrateAllFields() error {
	return db.Conn.AutoMigrate(
		&models.User{}, 
		&models.Role{}, 
		&models.Permission{}, 
		&models.UserRole{},
		&models.RolePermission{},
	)
}
