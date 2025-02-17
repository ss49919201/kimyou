import { vValidator } from "@hono/valibot-validator";
import { drizzle } from "drizzle-orm/d1";
import * as v from "valibot";
import { genders, UnsavedMonto } from "../../domain/model/monto";
import { insertMonto } from "../../infrastructure/db/d1/monto";
import { insertManyMontos as insertManyMontosUsecase } from "../../usecase/insertManyMontos";
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
    const params = c.req.valid("json");
    const db = drizzle(c.env.D1, { logger: true });

    await insertManyMontosUsecase(params, {
      insertMonto: (unsavedMonto: UnsavedMonto) =>
        insertMonto(db, unsavedMonto),
    });

    return c.json({ msg: "ok" });
  }
);
