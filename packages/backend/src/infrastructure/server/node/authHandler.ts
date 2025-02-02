import { Hono } from "hono";

export const authApp = new Hono();

// TODO: implement me
authApp.get("/login", (c) => {
  return c.json({
    message: "ok",
  });
});

// TODO: implement me
authApp.get("/logout", (c) => {
  return c.json({
    message: "ok",
  });
});
