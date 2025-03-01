package service

import (
	"context"
	"os"
	"time"

	"github.com/ss49919201/kimyou/infrastructure/scripts/cloudflare/infrastructure"
)

func RefreshServiceAuthToken() (time.Time, error) {
	apiToken, err := infrastructure.NewAPIToken(os.Getenv("API_TOKEN"))
	if err != nil {
		return time.Time{}, err
	}
	accountID, err := infrastructure.NewAccountID(os.Getenv("ACCOUNT_ID"))
	if err != nil {
		return time.Time{}, err
	}
	seriveAuthTokenID, err := infrastructure.NewSeriveAuthTokenID(os.Getenv("SERVICE_AUTH_TOKEN_ID"))
	if err != nil {
		return time.Time{}, err
	}

	result, err := infrastructure.RefreshServiceAuthToken(
		context.Background(),
		*apiToken,
		*accountID,
		*seriveAuthTokenID,
	)
	if err != nil {
		return time.Time{}, err
	}

	return result.ExpiresAt, nil
}
