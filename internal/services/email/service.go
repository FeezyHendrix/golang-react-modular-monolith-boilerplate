package email

import (
	"context"
	"fmt"

	"github.com/resend/resend-go/v2"
	"go.uber.org/zap"
)

type Config struct {
	ResendAPIKey string `envconfig:"RESEND_API_KEY" required:"true"`
	FromEmail    string `envconfig:"FROM_EMAIL" default:"noreply@yourdomain.com"`
	AppName      string `envconfig:"APP_NAME" default:"Echo Boilerplate"`
	AppURL       string `envconfig:"APP_URL" default:"http://localhost:3000"`
}

type Dependencies struct {
	Logger *zap.Logger
}

type service struct {
	*Config
	*Dependencies
	client *resend.Client
}

type Service interface {
	SendPasswordResetEmail(ctx context.Context, to, name, resetToken string) error
	SendTwoFactorCode(ctx context.Context, to, name, code string) error
	SendWelcomeEmail(ctx context.Context, to, name string) error
	SendEmailConfirmation(ctx context.Context, to, name, confirmToken string) error
}

func New(cfg *Config, deps *Dependencies) Service {
	client := resend.NewClient(cfg.ResendAPIKey)
	
	return &service{
		Config:       cfg,
		Dependencies: deps,
		client:       client,
	}
}

func (s *service) SendPasswordResetEmail(ctx context.Context, to, name, resetToken string) error {
	resetURL := fmt.Sprintf("%s/reset-password?token=%s", s.AppURL, resetToken)
	
	params := &resend.SendEmailRequest{
		From:    s.FromEmail,
		To:      []string{to},
		Subject: fmt.Sprintf("Reset your %s password", s.AppName),
		Html:    s.generatePasswordResetHTML(name, resetURL),
		Text:    s.generatePasswordResetText(name, resetURL),
	}

	_, err := s.client.Emails.Send(params)
	if err != nil {
		s.Logger.Error("failed to send password reset email", 
			zap.Error(err), 
			zap.String("to", to),
		)
		return err
	}

	s.Logger.Info("password reset email sent successfully", zap.String("to", to))
	return nil
}

func (s *service) SendTwoFactorCode(ctx context.Context, to, name, code string) error {
	params := &resend.SendEmailRequest{
		From:    s.FromEmail,
		To:      []string{to},
		Subject: fmt.Sprintf("Your %s verification code", s.AppName),
		Html:    s.generateTwoFactorHTML(name, code),
		Text:    s.generateTwoFactorText(name, code),
	}

	_, err := s.client.Emails.Send(params)
	if err != nil {
		s.Logger.Error("failed to send 2FA code email", 
			zap.Error(err), 
			zap.String("to", to),
		)
		return err
	}

	s.Logger.Info("2FA code email sent successfully", zap.String("to", to))
	return nil
}

func (s *service) SendWelcomeEmail(ctx context.Context, to, name string) error {
	params := &resend.SendEmailRequest{
		From:    s.FromEmail,
		To:      []string{to},
		Subject: fmt.Sprintf("Welcome to %s!", s.AppName),
		Html:    s.generateWelcomeHTML(name),
		Text:    s.generateWelcomeText(name),
	}

	_, err := s.client.Emails.Send(params)
	if err != nil {
		s.Logger.Error("failed to send welcome email", 
			zap.Error(err), 
			zap.String("to", to),
		)
		return err
	}

	s.Logger.Info("welcome email sent successfully", zap.String("to", to))
	return nil
}

func (s *service) SendEmailConfirmation(ctx context.Context, to, name, confirmToken string) error {
	confirmURL := fmt.Sprintf("%s/confirm-email?token=%s", s.AppURL, confirmToken)
	
	params := &resend.SendEmailRequest{
		From:    s.FromEmail,
		To:      []string{to},
		Subject: fmt.Sprintf("Confirm your %s email address", s.AppName),
		Html:    s.generateEmailConfirmationHTML(name, confirmURL),
		Text:    s.generateEmailConfirmationText(name, confirmURL),
	}

	_, err := s.client.Emails.Send(params)
	if err != nil {
		s.Logger.Error("failed to send email confirmation", 
			zap.Error(err), 
			zap.String("to", to),
		)
		return err
	}

	s.Logger.Info("email confirmation sent successfully", zap.String("to", to))
	return nil
}