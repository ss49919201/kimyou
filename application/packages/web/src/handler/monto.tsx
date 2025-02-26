import Monto from "../pages/montos/[id]";
import { drizzle } from "drizzle-orm/d1";
import { factory } from "./factory";
import { findOneMonto } from "../infrastructure/db/d1/montoReader";
import { HTTPException } from "hono/http-exception";

export const monto = factory.createHandlers(async (c) => {
  const id = c.req.param("id");

  if (!id) {
    throw new HTTPException(500, {
      message: "path parameter id is not found in monto handler",
    });
  }

  const db = drizzle(c.env.D1, { logger: true });
  const result = await findOneMonto(db, { id });

  if (!result) {
    throw new HTTPException(404, {
      message: "Monto not found",
    });
  }

  return c.render(<Monto {...result} />);
});
