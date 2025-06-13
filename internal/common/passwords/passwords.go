package passwords

import (
	"golang.org/x/crypto/bcrypt"
)

func GenerateHashFromPassword(pw string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(pw), 1)
}

func HashAndPasswordMatch(hashedPassword, password string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err == bcrypt.ErrMismatchedHashAndPassword {
		return false, nil
	}

	if err != nil {
		return false, err
	}

	return true, nil
}
