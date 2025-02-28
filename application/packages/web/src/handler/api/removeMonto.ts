import { vValidator } from "@hono/valibot-validator";
import { drizzle } from "drizzle-orm/d1";
import * as v from "valibot";
import { SavedMonto } from "../../domain/model/monto";
import {
  findOneForUpdate,
  updateMonto,
} from "../../infrastructure/db/d1/monto";
import { removeMonto as removeMontoUsecase } from "../../usecase/removeMonto";
import { factory } from "../factory";
import { vValidatorHook } from "../vValidator";

export const removeMonto = factory.createHandlers(
  vValidator(
    "json",
    v.object({
      id: v.string(),
      reason: v.string(),
    }),
    vValidatorHook()
  ),
  async (c) => {
    const params = c.req.valid("json");
    const db = drizzle(c.env.D1, { logger: true });

    await removeMontoUsecase(params, {
      findMonto: (id) => findOneForUpdate(db, id),
      updateMonto: (savedMonto: SavedMonto) => updateMonto(db, savedMonto),
    });

    return c.json({ msg: "ok" });
  }
);
