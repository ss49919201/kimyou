import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/infrastructure/db/d1/schema.ts",
  out: "./src/infrastructure/db/d1/migrations",
  dialect: "sqlite",
  driver: "d1-http",
  //   TODO:
  //   dbCredentials: {
  //     accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
  //     databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
  //     token: process.env.CLOUDFLARE_D1_TOKEN!,
  //   },
});
