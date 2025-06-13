package api

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (a *api) getHealthLive(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "live"})
}
