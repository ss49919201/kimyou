import GenerateHomyo from "../pages/homyos/generate";
import { factory } from "./factory";
import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { generateHomyos } from "../infrastructure/ai/workersAi/homyo";

export const generateHomyo = factory.createHandlers(
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

    return c.render(<GenerateHomyo {...{ homyos }} />);
  }
);
