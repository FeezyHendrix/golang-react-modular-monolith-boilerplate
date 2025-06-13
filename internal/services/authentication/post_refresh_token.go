package authentication

import (
	"context"
	"net/http"

	"github.com/feezyhendrix/echoboilerplate/internal/common/logger"
	"github.com/feezyhendrix/echoboilerplate/internal/common/validator"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

type RefreshTokenPayload struct {
	RefreshToken string `json:"refreshToken"`
}

func (s *service) PostRefreshToken(c echo.Context) error {

	payload := &RefreshTokenPayload{}
	req := c.Request()
	ctx := req.Context()
	lgr := logger.ContextLogger(ctx, s.Logger)
	if err := validator.BindAndValidate(c, payload); err != nil {
		lgr.Error("failed to bind and validate request", zap.Error(err))
		return c.NoContent(http.StatusBadRequest)
	}

	valid, tkns, err := s.refreshTokens(c.Request().Context(), payload.RefreshToken)

	if err != nil {
		lgr.Error("authentication service failed to refresh token", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	if !valid {
		return c.NoContent(http.StatusUnauthorized)
	}

	c.SetCookie(s.createAuthCookie(tkns.AccessToken))

	return c.JSON(http.StatusOK, tkns)
}

func (s *service) refreshTokens(ctx context.Context, refreshToken string) (bool, *Tokens, error) {
	valid, jwtUsr, err := s.validateToken(refreshToken)
	if err != nil || !valid {
		return false, nil, err
	}

	usr, err := s.Users.GetUserByID(ctx, uint(jwtUsr.UserID))

if err != nil {
		return false, nil, err
	}

	if usr == nil {
		return false, nil, nil
	}

	tkns, err := s.generateTokens(&TokenContext{
		UserID: float64(usr.ID),
	})

	return true, tkns, err
}
