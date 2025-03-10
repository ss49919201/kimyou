import { vValidator } from "@hono/valibot-validator";
import { drizzle } from "drizzle-orm/d1";
import * as v from "valibot";
import { genders, UnsavedMonto } from "../domain/model/monto";
import {
  insertMonto as insertMontoD1,
  maxNumberOfInsertableMontos,
} from "../infrastructure/db/d1/monto";
import { insertManyMontos as insertManyMontosUsecase } from "../usecase/insertManyMontos";
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
    const params = c.req.valid("form");
    const db = drizzle(c.env.D1, { logger: true });

    await insertManyMontosUsecase(
      {
        montos: [
          {
            ...params,
            firstName: params["first-name"],
            lastName: params["last-name"],
            phoneNumber: params["phone-number"],
            dateOfDeath: params["date-of-death"],
          },
        ],
        wetRun: true,
      },
      {
        insertMonto: (unsavedMonto: UnsavedMonto) =>
          insertMontoD1(db, unsavedMonto),
        maxNumberOfInsertableMontos,
      }
    );

    return c.redirect("/montos");
  }
);
