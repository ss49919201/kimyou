import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { genders } from "../../domain/model/monto";
import { factory } from "../factory";
import { vValidatorHook } from "../vValidator";

export const insertManyMontos = factory.createHandlers(
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
    }),
    vValidatorHook()
  ),
  async (c) => {
    return c.json({ msg: "ok" });
  }
);
