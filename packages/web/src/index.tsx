import { Hono } from "hono";
import Montos from "./pages/montos";
import { drizzle } from "drizzle-orm/d1";
import { findManyWithPage } from "./infrastructure/db/d1/monto";
import { basicAuth } from "hono/basic-auth";
import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";

type Bindings = {
  D1: D1Database;
  BASIC_USERNAME: string;
  BASIC_PASSWORD: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", async (c, next) => {
  const auth = basicAuth({
    username: c.env.BASIC_USERNAME,
    password: c.env.BASIC_PASSWORD,
  });
  return auth(c, next);
});

app.get(
  "/montos",
  vValidator(
    "query",
    v.object({
      "last-name": v.optional(v.string()),
    })
  ),
  async (c) => {
    const { "last-name": lastName } = c.req.valid("query");

    const db = drizzle(c.env.D1, { logger: true });
    const result = await findManyWithPage(db, { lastName });
    console.log("result", result);

    return c.html(<Montos {...result} />);
  }
);

export default app;
