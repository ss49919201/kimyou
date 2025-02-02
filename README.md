# kimyou

kmyou is temple management software.

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
pnpm add ${new_pkg} -w packages/${workspace} -E
```
