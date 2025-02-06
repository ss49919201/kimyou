import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/infrastructure/db/d1/schema.ts",
  out: "./src/infrastructure/db/d1/migrations",
  dialect: "sqlite",
  driver: "d1-http",
});
