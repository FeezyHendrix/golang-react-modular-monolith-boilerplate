package authentication

import (
	"fmt"
	"net/http"
	"time"

	"github.com/feezyhendrix/echoboilerplate/internal/common/logger"
	"github.com/feezyhendrix/echoboilerplate/internal/common/passwords"
	"github.com/feezyhendrix/echoboilerplate/internal/common/validator"
	"github.com/feezyhendrix/echoboilerplate/internal/models"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

// PostSignUpRequest moved to validator/schemas.go as SignUpRequest

func (s *service) PostSignUp(c echo.Context) error {
	var payload validator.SignUpRequest
	req := c.Request()
	ctx := req.Context()
	lgr := logger.ContextLogger(ctx, s.Logger)

	// Bind and validate request
	if err := validator.BindAndValidate(c, &payload); err != nil {
		lgr.Error("failed to bind and validate signup request", zap.Error(err))
		
		// Return validation errors in a structured format
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
		return c.NoContent(http.StatusInternalServerError)
	}

	if usr != nil {
		return c.NoContent(http.StatusConflict)
	}

	pw, err := passwords.GenerateHashFromPassword(payload.Password)
	if err != nil {
		lgr.Error("failed to hash password", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	emailConfirmToken, err := generateEmailConfirmToken()
	fmt.Println("Email Confirmation Token:", emailConfirmToken)
	if err != nil {
		lgr.Error("failed to generate email confirmation token", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	newUser := &models.User{
		Name:              payload.Name,
		Email:             payload.Email,
		Password:          string(pw),
		EmailConfirmed:    false,
		IsActive:          true,
		EmailConfirmToken: emailConfirmToken,
		TwoFactorEnabled:  false,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	if err := s.Users.CreateUser(ctx, newUser); err != nil {
		lgr.Error("failed to create user", zap.Error(err))
		return c.NoContent(http.StatusInternalServerError)
	}

	// Send welcome email
	if err := s.Email.SendWelcomeEmail(ctx, newUser.Email, newUser.Name); err != nil {
		lgr.Error("failed to send welcome email", zap.Error(err))
	}

	// Send email confirmation
	if err := s.Email.SendEmailConfirmation(ctx, newUser.Email, newUser.Name, emailConfirmToken); err != nil {
		lgr.Error("failed to send email confirmation", zap.Error(err))
	}

	jwt, err := s.generateTokens(&TokenContext{UserID: float64(newUser.ID)})
	if err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}

	return c.JSON(http.StatusOK, jwt)
}

// generateEmailConfirmToken generates a random token for email confirmation.
func generateEmailConfirmToken() (string, error) {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, 6)
	for i := range b {
		b[i] = letters[time.Now().UnixNano()%int64(len(letters))]
		time.Sleep(time.Nanosecond)
	}
	return string(b), nil
}
