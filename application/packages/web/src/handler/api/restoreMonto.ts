import { drizzle } from "drizzle-orm/d1";
import { HTTPException } from "hono/http-exception";
import { SavedMonto } from "../../domain/model/monto";
import { lock, unlock } from "../../infrastructure/db/d1/lock";
import {
  findOneForUpdate,
  updateMonto,
} from "../../infrastructure/db/d1/monto";
import { restoreMonto as restoreMontoUsecase } from "../../usecase/restoreMonto";
import { factory } from "../factory";

export const restoreMonto = factory.createHandlers(async (c) => {
  const id = c.req.param("id");

  if (!id) {
    throw new HTTPException(500, {
      message: "path parameter id is not found in monto handler",
    });
  }

  const db = drizzle(c.env.D1, { logger: true });

  await restoreMontoUsecase(
    { id },
    {
      findMonto: (id) => findOneForUpdate(db, id),
      updateMonto: (savedMonto: SavedMonto) => updateMonto(db, savedMonto),
      lock: (key) => lock(db, key),
      unlock: (key) => unlock(db, key),
    }
  );

  return c.json({ msg: "ok" });
});
