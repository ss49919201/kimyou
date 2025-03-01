.PHONY: refresh-service-auth-token

refresh-service-auth-token:
	API_TOKEN=$(API_TOKEN) ACCOUNT_ID=$(ACCOUNT_ID) SERVICE_AUTH_TOKEN_ID=$(SERVICE_AUTH_TOKEN_ID)
	go run cmd/refresh_service_auth_token/main.go
