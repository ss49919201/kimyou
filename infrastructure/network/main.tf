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

variable "cloudflare_api_token" {
  type = string
}

# Use `-var` or `-var-file`
# e.g. `terraform apply -var="cloudflare_api_token=xxx"`
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
