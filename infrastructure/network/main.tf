terraform {
  backend "s3" {
    # Define *.tfbackend, and use `-backend-config`
    # terraform init -backend-config=main.tfbackend
  }
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.1.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
