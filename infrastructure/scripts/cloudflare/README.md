# Cloudflare Integration Tests

This directory contains integration tests for the Cloudflare functionality.

## Running the Integration Tests

The integration tests require real Cloudflare API credentials to run. These credentials are provided through environment variables.

### Prerequisites

- Cloudflare account with API access
- Service auth token created in your Cloudflare account
- API token with appropriate permissions

### Environment Variables

Set the following environment variables before running the tests:

- `API_TOKEN`: Your Cloudflare API token
- `ACCOUNT_ID`: Your Cloudflare account ID
- `SERVICE_AUTH_TOKEN_ID`: The ID of the service token to refresh

### Running the Tests

```bash
# Set the integration test flag
export INTEGRATION_TEST="true"

# Set the required environment variables
export API_TOKEN="your-api-token"
export ACCOUNT_ID="your-account-id"
export SERVICE_AUTH_TOKEN_ID="your-service-token-id"

# Run the tests
go test -v ./...
```

### Test Skipping

The integration tests are skipped by default to avoid requiring API credentials during regular test runs. To run the integration tests, you must explicitly set the `INTEGRATION_TEST` environment variable to `true`.
