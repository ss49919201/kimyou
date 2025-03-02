package service

import (
	"os"
	"testing"
	"time"
)

func TestRefreshServiceAuthToken(t *testing.T) {
	if os.Getenv("INTEGRATION_TEST") != "true" {
		t.Skip()
	}

	// Get API credentials from environment variables
	apiTokenValue := os.Getenv("API_TOKEN")
	if apiTokenValue == "" {
		t.Fatal("API_TOKEN environment variable is required")
	}

	accountIDValue := os.Getenv("ACCOUNT_ID")
	if accountIDValue == "" {
		t.Fatal("ACCOUNT_ID environment variable is required")
	}

	serviceTokenIDValue := os.Getenv("SERVICE_AUTH_TOKEN_ID")
	if serviceTokenIDValue == "" {
		t.Fatal("SERVICE_AUTH_TOKEN_ID environment variable is required")
	}

	// Call the function being tested
	result, err := RefreshServiceAuthToken()

	// Verify the result
	if err != nil {
		t.Fatalf("RefreshServiceAuthToken returned an error: %v", err)
	}

	if result.IsZero() {
		t.Fatal("RefreshServiceAuthToken returned zero time")
	}

	// Check that the expiration time is in the future
	if !result.After(time.Now()) {
		t.Errorf("Expected expiration time to be in the future, got %v", result)
	}
}
