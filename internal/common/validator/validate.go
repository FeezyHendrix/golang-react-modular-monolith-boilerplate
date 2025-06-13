package validator

import (
	"regexp"
)

var (
	phoneRegex = regexp.MustCompile(`^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$`)
)


func ValidatePhone( /*validator *validator.Validate,*/ phone string) (bool, error) {
	// TODO: look into this
	/*
		if err := validator.Var(phone, "required,phone"); err != nil {
			return false, nil
		}
	*/

	if !phoneRegex.MatchString(phone) {
		return false, nil
	}

	return true, nil
}
