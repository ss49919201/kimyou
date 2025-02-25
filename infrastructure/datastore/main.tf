terraform {
  backend "s3" {
    # Define *.tfbackend, and use `-backend-config`
    # e.g. `terraform init -backend-config=main.tfbackend`
  }
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.1.0"
    }
  }
}

variable "cloudflare_account_id" {
  type = string
}

variable "cloudflare_api_token" {
  type = string
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_d1_database" "this" {
  account_id = var.cloudflare_account_id
  name = "kimyou"
}