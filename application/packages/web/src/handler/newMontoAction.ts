import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { genders } from "../domain/model/monto";
import { factory } from "./factory";
import { jstDateStrToDate } from "./helper/transform";
import { vValidatorHook } from "./vValidator";

export const newMontoAction = factory.createHandlers(
  vValidator(
    "form",
    v.object({
      gender: v.picklist(genders),
      "first-name": v.string(),
      "last-name": v.string(),
      "phone-number": v.string(),
      address: v.string(),
      "date-of-death": v.union([
        v.pipe(
          v.literal(""),
          v.transform(() => undefined)
        ),
        v.pipe(v.string(), v.isoDate(), v.transform(jstDateStrToDate)),
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
