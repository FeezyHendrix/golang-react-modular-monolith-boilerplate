package authentication

import (
	"net/http"
	"strings"

	authenticationcontext "github.com/feezyhendrix/echoboilerplate/internal/common/authentication_context"
	"github.com/feezyhendrix/echoboilerplate/internal/common/logger"
	"github.com/feezyhendrix/echoboilerplate/internal/models"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

func (s *service) AuthenticationMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			req := c.Request()
			lgr := logger.ContextLogger(req.Context(), s.Logger)
			authHdr := req.Header.Get("Authorization")

			if authHdr == "" {
				tkn, err := s.getAuthCookieValue(req)
				if err != nil {
					lgr.Info("failed to validate cookie token", zap.Error(err))
				}
				authHdr = tkn
			}

			if authHdr == "" {
				return c.NoContent(http.StatusUnauthorized)
			}

			flds := strings.Fields(authHdr)
			if len(flds) != 2 || strings.ToLower(flds[0]) != "bearer" {
				return c.NoContent(http.StatusUnauthorized)
			}

			valid, jwtUsr, err := s.validateToken(flds[1])

			if err != nil {
				lgr.Error("failed authentication middleware check", zap.Error(err))
				return c.NoContent(http.StatusInternalServerError)
			}
			if !valid {
				return c.NoContent(http.StatusUnauthorized)
			}

			req, err = authenticationcontext.SetUserContext(req, jwtUsr.UserID)
			if err != nil {
				return err
			}

			// Load full user with roles
			user, err := s.Users.GetUserByID(req.Context(), uint(jwtUsr.UserID))
			if err != nil {
				lgr.Error("failed to load user for authentication", zap.Error(err))
				return c.NoContent(http.StatusInternalServerError)
			}

			if user == nil {
				return c.NoContent(http.StatusUnauthorized)
			}

			// Load user roles
			var fullUser models.User
			err = s.Database.Conn.Preload("UserRoles.Role.Permissions").First(&fullUser, uint(user.ID)).Error
			if err != nil {
				lgr.Error("failed to load user roles", zap.Error(err))
				return c.NoContent(http.StatusInternalServerError)
			}

			// Set user in context for middleware to access
			c.Set("user", &fullUser)
			c.SetRequest(req)
			return next(c)
		}
	}
}
