import { Hono } from "hono";
import GenerateHomyo from "./pages/homyos/generate";
import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { generateHomyos } from "./infrastructure/ai/workersAi/homyo";
import { Bindings } from "./handler/bindings";
import { findManyMontosHandler } from "./handler/findManyMontosHandler";
import { findOneMontoHandler } from "./handler/findOneMonto";
import { indexHandler } from "./handler";
import { insertManyMontos } from "./handler/insertManyMontos";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", ...indexHandler);

app.get("/montos", ...findManyMontosHandler);

app.get("/montos/:id", ...findOneMontoHandler);

app.post("/montos/_batch", ...insertManyMontos);

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
