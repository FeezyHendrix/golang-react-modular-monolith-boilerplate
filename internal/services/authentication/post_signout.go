package authentication

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (s *service) PostSignOut(c echo.Context) error {
	s.clearAuthCookie(c)
	return c.NoContent(http.StatusOK)
}
