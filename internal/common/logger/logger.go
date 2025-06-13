package logger

import (
	"context"
	"fmt"
	"time"

	authenticationcontext "github.com/feezyhendrix/echoboilerplate/internal/common/authentication_context"
	"github.com/feezyhendrix/echoboilerplate/internal/common/environment"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type CustomLogger struct {
	Validator *validator.Validate
}

type key string

const (
	requestLogContextKey = key("request_log_context_key")
)

type hTTPRequestLogContext struct {
	ID           string
	Method       string
	URL          string
	ProjectID    string
	ClientIPAddr string
}

func RequestLoggerMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			req := c.Request()
			ctx := req.Context()

			reqLogCtx := &hTTPRequestLogContext{
				Method:       req.Method,
				URL:          req.URL.String(),
				ClientIPAddr: req.Header.Get("X-FORWARDED-FOR"),
			}

			// client ip address
			if reqLogCtx.ClientIPAddr == "" {
				reqLogCtx.ClientIPAddr = req.RemoteAddr
			}

			// request id
			reqLogCtx.ID = req.Header.Get(echo.HeaderXRequestID)
			if reqLogCtx.ID == "" {
				reqLogCtx.ID = c.Response().Header().Get(echo.HeaderXRequestID)
			}

			// project id
			reqLogCtx.ProjectID = c.Param("projectId")

			if reqLogCtx.ID != "" {
				c.Response().Header().Set(echo.HeaderXRequestID, reqLogCtx.ID)
			}

			c.SetRequest(req.Clone(context.WithValue(ctx, requestLogContextKey, reqLogCtx)))
			return next(c)
		}
	}
}

// ContextLogger returns a logger with all known context
func ContextLogger(ctx context.Context, lgr *zap.Logger) *zap.Logger {
	if lgr == nil {
		return lgr
	}

	fields := []zapcore.Field{}

	// extract http request context
	cVal := ctx.Value(requestLogContextKey)
	if cVal != nil {
		lCtx := cVal.(*hTTPRequestLogContext)
		if lCtx.ID != "" {
			fields = append(fields, zap.String("request_id", lCtx.ID))
		}

		if lCtx.Method != "" {
			fields = append(fields, zap.String("request_method", lCtx.Method))
		}

		if lCtx.URL != "" {
			fields = append(fields, zap.String("request_url", lCtx.URL))
		}

		if lCtx.ProjectID != "" {
			fields = append(fields, zap.String("request_project_id", lCtx.ProjectID))
		}

		if lCtx.ClientIPAddr != "" {
			fields = append(fields, zap.String("request_client_ip", lCtx.ClientIPAddr))
		}
	}

	// extract authenticated user context
	usrCtx := authenticationcontext.ParseUserContext(ctx)
	if usrCtx != nil {
		usrID := fmt.Sprintf("%+v", usrCtx.UserID)
		fields = append(fields, zap.String("request_user_id", usrID))
	}

	return lgr.With(fields...)
}

func FuncExecTime(logger zap.Logger, env environment.EnvironmentType, fmtString string, args ...any) func() {
	if env == environment.Production {
		return func() {
			// skip for production
		}
	}
	start := time.Now()
	return func() {
		allArgs := append(args, time.Since(start))
		logger.Debug(fmt.Sprintf(fmtString+" --> took %s\n", allArgs...))
	}
}
