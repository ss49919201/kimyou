import { serve, type HttpBindings } from "@hono/node-server";
import { Hono } from "hono";
import { authApp } from "./authHandler";

type Bindings = HttpBindings;

const app = new Hono<{ Bindings: Bindings }>();

// health check
app.get("/health", (c) => {
  return c.json({
    message: "ok",
  });
});

// /auth
app.route("/auth", authApp);

export function runServer(): void {
  serve(app);
}
