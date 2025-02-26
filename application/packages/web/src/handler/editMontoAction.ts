import { vValidator } from "@hono/valibot-validator";
import { drizzle } from "drizzle-orm/d1";
import { HTTPException } from "hono/http-exception";
import * as v from "valibot";
import { SavedMonto } from "../domain/model/monto";
import {
  findOneForUpdate,
  updateMonto as updateMontoD1,
} from "../infrastructure/db/d1/monto";
import { updateMonto as updateMontoUsecase } from "../usecase/updateMonto";
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
    const id = c.req.param("id");

    if (!id) {
      throw new HTTPException(500, {
        message: "path parameter id is not found in monto handler",
      });
    }

    const params = c.req.valid("form");
    const db = drizzle(c.env.D1, { logger: true });

    await updateMontoUsecase(
      {
        ...params,
        phoneNumber: params["phone-number"],
        dateOfDeath: params["date-of-death"],
        id,
      },
      {
        updateMonto: (savedMonto: SavedMonto) => updateMontoD1(db, savedMonto),
        findMonto: (id) => findOneForUpdate(db, id),
      }
    );

    return c.redirect("/montos");
  }
);
