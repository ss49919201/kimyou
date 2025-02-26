import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { factory } from "./factory";
import { vValidatorHook } from "./vValidator";

export const editMontoAction = factory.createHandlers(
  vValidator(
    "form",
    v.object({
      "phone-number": v.string(),
      address: v.string(),
      "date-of-death": v.union([
        v.pipe(
          v.literal(""),
          v.transform(() => undefined)
        ),
        v.pipe(
          v.string(),
          v.isoDateTime(),
          v.transform((v) => new Date(v))
        ),
      ]),
      homyo: v.union([
        v.pipe(
          v.literal(""),
          v.transform(() => undefined)
        ),
        v.string(),
      ]),
      ingou: v.union([
        v.pipe(
          v.literal(""),
          v.transform(() => undefined)
        ),
        v.string(),
      ]),
    }),
    vValidatorHook()
  ),
  async (c) => {
    return c.redirect("/montos");
  }
);
