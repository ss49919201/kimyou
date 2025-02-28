import { vValidator } from "@hono/valibot-validator";
import { drizzle } from "drizzle-orm/d1";
import { HTTPException } from "hono/http-exception";
import * as v from "valibot";
import { inactiveMontoReason, SavedMonto } from "../../domain/model/monto";
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
      reason: v.picklist(inactiveMontoReason),
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

    const params = c.req.valid("json");
    const db = drizzle(c.env.D1, { logger: true });

    await removeMontoUsecase(
      {
        ...params,
        id,
      },
      {
        findMonto: (id) => findOneForUpdate(db, id),
        updateMonto: (savedMonto: SavedMonto) => updateMonto(db, savedMonto),
      }
    );

    return c.json({ msg: "ok" });
  }
);
