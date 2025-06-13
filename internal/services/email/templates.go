package email

import "fmt"

func (s *service) generatePasswordResetHTML(name, resetURL string) string {
	return fmt.Sprintf(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e9ecef; }
        .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>%s</h1>
        </div>
        <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hi %s,</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
                <a href="%s" class="button">Reset Password</a>
            </p>
            <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            <p>This reset link will expire in 1 hour for security reasons.</p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">%s</p>
        </div>
        <div class="footer">
            <p>This email was sent by %s. If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>`, s.AppName, name, resetURL, resetURL, s.AppName)
}

func (s *service) generatePasswordResetText(name, resetURL string) string {
	return fmt.Sprintf(`
Reset Your Password

Hi %s,

We received a request to reset your password for your %s account.

To reset your password, please visit the following link:
%s

If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.

This reset link will expire in 1 hour for security reasons.

Best regards,
The %s Team
`, name, s.AppName, resetURL, s.AppName)
}

func (s *service) generateTwoFactorHTML(name, code string) string {
	return fmt.Sprintf(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Verification Code</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e9ecef; }
        .code { font-size: 32px; font-weight: bold; text-align: center; background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; letter-spacing: 4px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>%s</h1>
        </div>
        <div class="content">
            <h2>Your Verification Code</h2>
            <p>Hi %s,</p>
            <p>Here's your verification code:</p>
            <div class="code">%s</div>
            <p>This code will expire in 10 minutes for security reasons.</p>
            <p>If you didn't request this code, please ignore this email and consider changing your password.</p>
        </div>
        <div class="footer">
            <p>This email was sent by %s. Never share your verification codes with anyone.</p>
        </div>
    </div>
</body>
</html>`, s.AppName, name, code, s.AppName)
}

func (s *service) generateTwoFactorText(name, code string) string {
	return fmt.Sprintf(`
Your Verification Code

Hi %s,

Here's your verification code: %s

This code will expire in 10 minutes for security reasons.

If you didn't request this code, please ignore this email and consider changing your password.

Best regards,
The %s Team
`, name, code, s.AppName)
}

func (s *service) generateWelcomeHTML(name string) string {
	return fmt.Sprintf(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to %s!</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e9ecef; }
        .button { display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to %s!</h1>
        </div>
        <div class="content">
            <h2>Welcome aboard, %s!</h2>
            <p>Thank you for joining %s. We're excited to have you as part of our community.</p>
            <p>Your account has been successfully created and you can now start using our platform.</p>
            <p style="text-align: center;">
                <a href="%s" class="button">Get Started</a>
            </p>
            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
        </div>
        <div class="footer">
            <p>Welcome to %s! We're here to help you succeed.</p>
        </div>
    </div>
</body>
</html>`, s.AppName, s.AppName, name, s.AppName, s.AppURL, s.AppName)
}

func (s *service) generateWelcomeText(name string) string {
	return fmt.Sprintf(`
Welcome to %s!

Hi %s,

Thank you for joining %s. We're excited to have you as part of our community.

Your account has been successfully created and you can now start using our platform.

Get started by visiting: %s

If you have any questions or need help getting started, don't hesitate to reach out to our support team.

Best regards,
The %s Team
`, s.AppName, name, s.AppName, s.AppURL, s.AppName)
}

func (s *service) generateEmailConfirmationHTML(name, confirmURL string) string {
	return fmt.Sprintf(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Email</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e9ecef; }
        .button { display: inline-block; padding: 12px 24px; background: #17a2b8; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>%s</h1>
        </div>
        <div class="content">
            <h2>Confirm Your Email Address</h2>
            <p>Hi %s,</p>
            <p>Please confirm your email address by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="%s" class="button">Confirm Email</a>
            </p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #17a2b8;">%s</p>
        </div>
        <div class="footer">
            <p>This email was sent by %s.</p>
        </div>
    </div>
</body>
</html>`, s.AppName, name, confirmURL, confirmURL, s.AppName)
}

func (s *service) generateEmailConfirmationText(name, confirmURL string) string {
	return fmt.Sprintf(`
Confirm Your Email Address

Hi %s,

Please confirm your email address by visiting the following link:
%s

If you didn't create an account, you can safely ignore this email.

Best regards,
The %s Team
`, name, confirmURL, s.AppName)
}