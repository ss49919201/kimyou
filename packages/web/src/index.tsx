import { Hono } from "hono";
import Index from "./pages";
import Montos from "./pages/montos";
import Monto from "./pages/montos/[id]";
import { drizzle } from "drizzle-orm/d1";
import { findManyWithPage, findOne } from "./infrastructure/db/d1/monto";
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

app.get("/", async (c) => {
  return c.html(<Index />);
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

    return c.html(<Montos {...result} />);
  }
);

app.get("/montos/:id", async (c) => {
  const id = c.req.param("id");

  const db = drizzle(c.env.D1, { logger: true });
  const result = await findOne(db, { id });

  if (!result) {
    return c.text("Not found");
  }

  return c.html(<Monto {...result} />);
});

export default app;
