package authenticationcontext

import (
	"context"
	"net/http"
)

type UserContext struct {
	UserID         float64 `json:"userId"`
}
type userContextKeyType string

const (
	userContextHeaderKey = "User-Context"
	userContextKey       = userContextKeyType("user_context_key")
)

func MustParseUserContext(req *http.Request) *UserContext {
	euc := ParseUserContext(req.Context())
	if euc == nil {
		panic("No ErnestUserContext in context")
	}

	return euc
}

func ParseUserContext(ctx context.Context) *UserContext {
	euc := ctx.Value(userContextKey)
	if euc == nil {
		return nil
	}

	return euc.(*UserContext)
}

func SetUserContext(req *http.Request, userID float64) (*http.Request, error) {
	euc := &UserContext{
		UserID:         userID,
	}

	req = req.Clone(context.WithValue(req.Context(), userContextKey, euc))
	return req, nil
}
