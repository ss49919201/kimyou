import { Hono } from "hono";
import Index from "./pages";
import GenerateHomyo from "./pages/homyos/generate";
import { drizzle } from "drizzle-orm/d1";
import { insertMonto } from "./infrastructure/db/d1/monto";
import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { generateHomyos } from "./infrastructure/ai/workersAi/homyo";
import { insertMontos } from "./usecase/insertMontos";
import { genders, UnsavedMonto } from "./domain/model/monto";
import { Bindings } from "./handler/bindings";
import { findManyMontosHandler } from "./handler/findManyMontosHandler";
import { findOneMontoHandler } from "./handler/findOneMonto";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  return c.html(<Index />);
});

app.get("/montos", ...findManyMontosHandler);

app.get("/montos/:id", ...findOneMontoHandler);

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
