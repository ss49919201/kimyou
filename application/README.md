# Important information

kimyou does not implement authentication.

Use Cloudflare Access for authentication.

# Getting started

## Prerequisites

- Cloudflare account with API access
- Development Tools
    - `node`
    - `pnpm`

## Deploy Web Application

Change dir.

```bash
cd ./packages/web
```

Create `./wrangler.json`. 

ref: `./wrangler.local.json`

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "kimyou",
  <snip>
}
```

Execute migration.

```bash
pnpm drizzle:migrate
```

Insert master data. 

use: `./packages/web/src/infrastructure/db/d1/master`

Deploy application.

```bash
pnpm deploy
```

### Local development

Execute migration.

```bash
pnpm drizzle:migrate:local
```

Insert master data. 

use: `./packages/web/src/infrastructure/db/d1/master`

Start a local server.

```bash
pnpm dev
```

## Deploy Batch Application

Change dir.

```bash
cd ./packages/batch-release-lock
```

Create `./wrangler.json`. 

ref: `./wrangler.local.json`

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "kimyou",
  <snip>
}
```

Deploy application.

```bash
pnpm deploy
```

### Local development

Start a local server.

```bash
pnpm dev
```

```bash
curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"
```

# Development tips

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
