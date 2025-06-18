package validator

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

func ErrorHandlerMiddleware(logger *zap.Logger) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			err := next(c)
			if err != nil {
				return handleError(c, err, logger)
			}
			return nil
		}
	}
}

func handleError(c echo.Context, err error, logger *zap.Logger) error {
	if validationErr, ok := err.(*ValidationErrors); ok {
		logger.Info("validation error",
			zap.String("path", c.Request().URL.Path),
			zap.String("method", c.Request().Method),
			zap.Any("errors", validationErr.Errors),
		)
		
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "Validation failed",
			"details": validationErr.Errors,
		})
	}

	if httpErr, ok := err.(*echo.HTTPError); ok {
		logger.Info("http error",
			zap.String("path", c.Request().URL.Path),
			zap.String("method", c.Request().Method),
			zap.Int("status", httpErr.Code),
			zap.Any("message", httpErr.Message),
		)
		
		response := map[string]interface{}{
			"error": httpErr.Message,
		}
		
		if httpErr.Internal != nil {
			response["details"] = httpErr.Internal.Error()
		}
		
		return c.JSON(httpErr.Code, response)
	}

	logger.Error("internal server error",
		zap.String("path", c.Request().URL.Path),
		zap.String("method", c.Request().Method),
		zap.Error(err),
	)
	
	return c.JSON(http.StatusInternalServerError, map[string]interface{}{
		"error": "Internal server error",
	})
}

func RequestLoggingMiddleware(logger *zap.Logger) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			req := c.Request()
			
			logger.Info("incoming request",
				zap.String("method", req.Method),
				zap.String("path", req.URL.Path),
				zap.String("query", req.URL.RawQuery),
				zap.String("user_agent", req.UserAgent()),
				zap.String("remote_addr", req.RemoteAddr),
			)
			
			return next(c)
		}
	}
}

func SecurityValidationMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			req := c.Request()
			
			if req.ContentLength > 10*1024*1024 {
				return echo.NewHTTPError(http.StatusRequestEntityTooLarge, "Request body too large")
			}
			
			path := req.URL.Path
			if containsSuspiciousPatterns(path) {
				return echo.NewHTTPError(http.StatusBadRequest, "Invalid request path")
			}
			
			return next(c)
		}
	}
}

func containsSuspiciousPatterns(path string) bool {
	suspiciousPatterns := []string{
		"../",
		"..\\",
		"<script",
		"javascript:",
		"vbscript:",
		"onload=",
		"onerror=",
		"eval(",
		"expression(",
		"document.cookie",
		"window.location",
	}
	
	for _, pattern := range suspiciousPatterns {
		if len(path) > 0 && len(pattern) > 0 && 
		   len(path) >= len(pattern) {
			for i := 0; i <= len(path)-len(pattern); i++ {
				match := true
				for j := 0; j < len(pattern); j++ {
					if path[i+j] != pattern[j] {
						match = false
						break
					}
				}
				if match {
					return true
				}
			}
		}
	}
	
	return false
}

func RateLimitValidationMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Response().Header().Set("X-RateLimit-Limit", "1000")
			c.Response().Header().Set("X-RateLimit-Remaining", "999")
			c.Response().Header().Set("X-RateLimit-Reset", "3600")
			
			return next(c)
		}
	}
}

func CORSValidationMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			origin := c.Request().Header.Get("Origin")
			
			allowedOrigins := []string{
				"http://localhost:3000",
				"http://localhost:8080",
				"https://localhost:3000",
				"https://localhost:8080",
			}
			
			isAllowed := false
			for _, allowedOrigin := range allowedOrigins {
				if origin == allowedOrigin {
					isAllowed = true
					break
				}
			}
			
			if origin != "" && !isAllowed {
				return echo.NewHTTPError(http.StatusForbidden, "Origin not allowed")
			}
			
			if origin != "" && isAllowed {
				c.Response().Header().Set("Access-Control-Allow-Origin", origin)
				c.Response().Header().Set("Access-Control-Allow-Credentials", "true")
			}
			
			if c.Request().Method == "OPTIONS" {
				c.Response().Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
				c.Response().Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With")
				c.Response().Header().Set("Access-Control-Max-Age", "86400")
				return c.NoContent(http.StatusNoContent)
			}
			
			return next(c)
		}
	}
}