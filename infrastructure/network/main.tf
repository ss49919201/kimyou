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

variable "allow_emails" {
  type = list(string)
}

variable "domain" {
  type = string
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_zero_trust_access_service_token" "this" {
  account_id = var.cloudflare_account_id
  name = "kimyou-api-auth"
}


resource "cloudflare_zero_trust_access_application" "this" {
  account_id = var.cloudflare_account_id
  domain     = var.domain
  type       = "self_hosted"
  policies = [
    {
      precedence = 1
      name       = "kimyou-service-auth-policy"
      decision   = "non_identity"
      include = [
        {
          service_token = {
            token_id = cloudflare_zero_trust_access_service_token.this.id
          }
        },
      ]
    },
    {
      precedence = 2
      name       = "kimyou-allow-policy"
      decision   = "allow"
      include = [for allow_email in var.allow_emails : {
        email = {
          email = allow_email
        }
      }]
    },
  ]
}