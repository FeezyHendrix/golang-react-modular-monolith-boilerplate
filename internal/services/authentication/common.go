
package authentication

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"

	"github.com/feezyhendrix/echoboilerplate/internal/common/passwords"
)

func (s *service) validateToken(tkn string) (bool, *TokenContext, error) {
	token, err := jwt.Parse(tkn, func(t *jwt.Token) (any, error) {
		return []byte(s.Config.JWTSecret), nil
	})

	if err != nil || !token.Valid {
		return false, nil, nil
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return false, nil, nil
	}

	jwtUsr, err := s.parseTokenContext(claims)
	return token.Valid, jwtUsr, err
}

func (s *service) parseTokenContext(claims jwt.MapClaims) (*TokenContext, error) {
	userID, usrOk := claims["userId"].(float64)
	if !usrOk {
		return nil, fmt.Errorf("failed to parse jwt claims")
	}
	usr := &TokenContext{
		UserID:         userID,
	}

	return usr, s.Validate.Struct(usr)
}

func (s *service) generateToken(usr *TokenContext, iatUnix, expUnix int64) (string, error) {
	ajwt := jwt.New(jwt.SigningMethodHS256)
	claims := ajwt.Claims.(jwt.MapClaims)
	claims["userId"] = usr.UserID
	claims["iat"] = iatUnix
	claims["exp"] = expUnix

	return ajwt.SignedString([]byte(s.Config.JWTSecret))
}

// TODO: Implement Refresh Token Rotation Automatic Reuse Detection
// For now we're focused on maintaining previous implementation
func (s *service) generateTokens(usr *TokenContext) (*Tokens, error) {
	nowUnix := time.Now().Unix()
	accessToken, err := s.generateToken(usr, nowUnix, time.Now().Add(time.Second*time.Duration(s.AccessTokenTTLSecs)).Unix())
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.generateToken(usr, nowUnix, time.Now().Add(time.Second*time.Duration(s.RefreshTokenTTLSecs)).Unix())
	if err != nil {
		return nil, err
	}

	return &Tokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *service) updateUserPassword(ctx context.Context, usrID float64, pw string) error {
	hashByts, err := passwords.GenerateHashFromPassword(pw)
	if err != nil {
		return err
	}

	return  s.Users.UpdateUserPassword(ctx, uint(usrID), string(hashByts))
}

const (
	authCookieName = "AccessToken"
)

func (s *service) createAuthCookie(accessToken string) *http.Cookie {
	return &http.Cookie{
		Name:     authCookieName,
		HttpOnly: true,
		Value:    "Bearer " + accessToken,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(time.Second * time.Duration(s.AccessTokenTTLSecs)),
	}
}

func (s *service) getAuthCookieValue(req *http.Request) (string, error) {
	ck, err := req.Cookie(authCookieName)
	if err != nil {
		return "", err
	}

	return ck.Value, nil
}

func (s *service) clearAuthCookie(c echo.Context) {
	c.SetCookie(&http.Cookie{
		Name:     authCookieName,
		Value:    "",
		MaxAge:   -1,
		Path:     "/",
		Secure:   true,
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
	})
}
