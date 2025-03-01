import {
  defineWorkersConfig,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig(async () => {
  const migrations = await readD1Migrations(
    "./src/infrastructure/db/d1/migrations"
  );

  return {
    test: {
      includeSource: ["./src/**/*.{js,ts}"],
      poolOptions: {
        workers: {
          wrangler: { configPath: "./wrangler.e2e.json" },
          miniflare: {
            bindings: {
              D1_MIGRATIONS: migrations,
            },
          },
        },
      },
    },
  };
});
