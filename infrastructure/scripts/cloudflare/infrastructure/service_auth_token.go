package infrastructure

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/cloudflare/cloudflare-go/v4"
	"github.com/cloudflare/cloudflare-go/v4/zero_trust"
)

type SeriveAuthTokenID struct {
	value string
}

func (s *SeriveAuthTokenID) Value() string {
	return s.value
}

func NewSeriveAuthTokenID(value string) (*SeriveAuthTokenID, error) {
	if value == "" {
		return nil, errors.New("service auth account token id must be greater than equal to 1")
	}
	return &SeriveAuthTokenID{value}, nil
}

type RefreshServiceAuthTokenResult struct {
	ExpiresAt time.Time
}

func RefreshServiceAuthToken(
	ctx context.Context,
	apiToken APIToken,
	accountID AccountID,
	serviceTokenID SeriveAuthTokenID,
) (*RefreshServiceAuthTokenResult, error) {
	client := newClient(apiToken)

	res, err := client.ZeroTrust.Access.ServiceTokens.Refresh(
		ctx,
		serviceTokenID.Value(),
		zero_trust.AccessServiceTokenRefreshParams{
			AccountID: cloudflare.F(accountID.Value()),
		},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to refresh service auth token: %w", err)
	}

	return &RefreshServiceAuthTokenResult{
		ExpiresAt: res.ExpiresAt,
	}, nil
}
