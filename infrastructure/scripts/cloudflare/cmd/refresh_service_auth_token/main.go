package main

import (
	"fmt"
	"os"
	"time"

	"github.com/ss49919201/kimyou/infrastructure/scripts/cloudflare/service"
)

func main() {
	expiresAt, err := service.RefreshServiceAuthToken()
	if err != nil {
		fmt.Println("error occurred: " + err.Error())
		os.Exit(1)
	}

	fmt.Println("✅ new expiresAt: " + expiresAt.Format(time.RFC3339Nano))
}
