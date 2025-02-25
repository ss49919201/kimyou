declare module "cloudflare:test" {
  // Controls the type of `import("cloudflare:test").env`
  interface ProvidedEnv extends Env {
    D1: D1Database;
    D1_MIGRATIONS: D1Migration[];
  }
}
