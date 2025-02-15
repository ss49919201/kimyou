import Monto from "../pages/montos/[id]";
import { drizzle } from "drizzle-orm/d1";
import { factory } from "./factory";
import { findOne } from "../infrastructure/db/d1/monto";
import { HTTPException } from "hono/http-exception";

export const findOneMonto = factory.createHandlers(async (c) => {
  const id = c.req.param("id");

  if (!id) {
    console.error("path parameter id is not found in monto handler");
    throw new HTTPException(500);
  }

  const db = drizzle(c.env.D1, { logger: true });
  const result = await findOne(db, { id });

  if (!result) {
    return c.text("Not found");
  }

  return c.html(<Monto {...result} />);
});
