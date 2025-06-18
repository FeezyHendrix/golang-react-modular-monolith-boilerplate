package validator

import (
	"regexp"
)

var (
	phoneRegex = regexp.MustCompile(`^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$`)
)


func ValidatePhone(phone string) (bool, error) {

	if !phoneRegex.MatchString(phone) {
		return false, nil
	}
	return true, nil
}
