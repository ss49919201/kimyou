package infrastructure

import (
	"errors"

	"github.com/cloudflare/cloudflare-go/v4"
	"github.com/cloudflare/cloudflare-go/v4/option"
)

type APIToken struct {
	value string
}

func (a *APIToken) Value() string {
	return a.value
}

func NewAPIToken(value string) (*APIToken, error) {
	if value == "" {
		return nil, errors.New("api token must be greater than equal to 1")
	}
	return &APIToken{value}, nil
}

type AccountID struct {
	value string
}

func (a *AccountID) Value() string {
	return a.value
}

func NewAccountID(value string) (*AccountID, error) {
	if value == "" {
		return nil, errors.New("account id must be greater than equal to 1")
	}
	return &AccountID{value}, nil
}

func newClient(apiToken APIToken) *cloudflare.Client {
	return cloudflare.NewClient(option.WithAPIToken(apiToken.Value()))
}
