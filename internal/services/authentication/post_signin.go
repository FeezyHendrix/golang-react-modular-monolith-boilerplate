package authentication

import (
	"net/http"

	"github.com/feezyhendrix/echoboilerplate/internal/common/logger"
	"github.com/feezyhendrix/echoboilerplate/internal/common/passwords"
	"github.com/feezyhendrix/echoboilerplate/internal/common/validator"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)


type Tokens struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type TokenContext struct {
	UserID float64 `json:"userId" validate:"required"`
}

func (s *service) PostSignIn(c echo.Context) error {
	var payload validator.SignInRequest
	req := c.Request()
	ctx := req.Context()
	lgr := logger.ContextLogger(ctx, s.Logger)

	if err := validator.BindAndValidate(c, &payload); err != nil {
		lgr.Error("failed to bind and validate signin request", zap.Error(err))
		
		if validationErr, ok := err.(*validator.ValidationErrors); ok {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{
				"error":   "Validation failed",
				"details": validationErr.Errors,
			})
		}
		
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "Invalid request format",
			"details": err.Error(),
		})
	}

	usr, err := s.Users.GetUserByEmail(ctx, payload.Email)
	if err != nil {
		lgr.Error("failed to get user by email", zap.Error(err))
		return c.NoContent(http.StatusBadRequest)
	}

	if usr == nil {
		return c.NoContent(http.StatusNotFound)
	}

	match, err := passwords.HashAndPasswordMatch(usr.Password, payload.Password)
	if err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}

	if !match {
		return c.NoContent(http.StatusBadRequest)
	}

	jwt, err := s.generateTokens(&TokenContext{UserID: float64(usr.ID)})
	if err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}

	c.SetCookie(s.createAuthCookie(jwt.AccessToken))

	return c.JSON(http.StatusOK, jwt)

}
