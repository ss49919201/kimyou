# Getting started

## Prerequisites

- Cloudflare account with API access
- Service auth token created in your Cloudflare account
- API token with appropriate permissions
- Development Tools
    - `terraform`

## Apply datastore state

Create \<any>\.tfbackend.

```
bucket  = <your-bucket>
key     = <state-key>
region  = <bucket-region>
```

Initializes a working directory.

```bash
terraform init -backend-config=<any>.tfbackend
```

Creates an execution plan and execute plan.

```bash
terraform plan
terraform apply
```

## Apply network state

Create \<any>\.tfbackend.

```
bucket  = <your-bucket>
key     = <state-key>
region  = <bucket-region>
```

Initializes a working directory.

```bash
terraform init -backend-config=<any>.tfbackend
```

Creates an execution plan and execute plan.

```bash
terraform plan
terraform apply
```
