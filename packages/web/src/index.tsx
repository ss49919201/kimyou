import { Hono } from "hono";
import Index from "./pages";
import Montos from "./pages/montos";
import Monto from "./pages/montos/[id]";
import GenerateHomyo from "./pages/homyos/generate";
import { drizzle } from "drizzle-orm/d1";
import {
  findManyWithPage,
  findOne,
  insertMonto,
} from "./infrastructure/db/d1/monto";
import { basicAuth } from "hono/basic-auth";
import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { generateHomyos } from "./infrastructure/ai/workersAi/homyo";
import { insertMontos } from "./usecase/insertMontos";
import { genders, UnsavedMonto, unsavedMonto } from "./domain/model/monto";

type Bindings = {
  ENV: string;
  D1: D1Database;
  BASIC_USERNAME: string;
  BASIC_PASSWORD: string;
  AI: Ai;
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

app.post(
  "/montos/_batch",
  vValidator(
    "json",
    v.object({
      wetRun: v.boolean(),
      montos: v.array(
        v.object({
          gender: v.picklist(genders),
          firstName: v.string(),
          lastName: v.string(),
          phoneNumber: v.string(),
          address: v.string(),
          dateOfDeath: v.optional(v.date()),
          homyo: v.optional(v.string()),
          ingou: v.optional(v.string()),
        })
      ),
    })
  ),
  async (c) => {
    const params = c.req.valid("json");
    const db = drizzle(c.env.D1, { logger: true });

    await insertMontos(params, {
      insertMonto: (unsavedMonto: UnsavedMonto) =>
        insertMonto(db, unsavedMonto),
    });

    return c.json({ msg: "ok" });
  }
);

app.get(
  "/homyos/generate",
  vValidator(
    "query",
    v.object({
      "first-name": v.optional(v.string()),
    })
  ),
  async (c) => {
    const { "first-name": firstName } = c.req.valid("query");
    const homyos: string[] = [];

    if (firstName) {
      homyos.push(...(await generateHomyos(c.env.ENV, c.env.AI, firstName)));
    }

    return c.html(<GenerateHomyo {...{ homyos }} />);
  }
);

export default app;
