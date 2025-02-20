# kimyou

kmyou is temple management software.
kimyou is an application hosted by a Cloudflare workers.

Demo: https://kimyou-demo.ss49919201.workers.dev/

# For Developer

## Add new workspace

```bash
mkdir packages/${new_workspace}
cd packages/${new_workspace}
pnpm init
```

## Add new package

```bash
# Add new package to workspace root
pnpm add ${new_pkg} -w -E

# Add new package to specific workspace
pnpm ${workspace} add ${new_pkg} -E
# or
cd packages/${workspace} && pnpm add ${new_pkg} -E
```

## Authentication

kimyou does not implement authentication.
Recommend using Cloudflare Access for authentication.
