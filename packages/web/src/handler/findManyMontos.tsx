import Montos from "../pages/montos";
import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { drizzle } from "drizzle-orm/d1";
import { factory } from "./factory";
import { findManyWithPage } from "../infrastructure/db/d1/monto";
import { vValidatorHook } from "./vValidator";

export const findManyMontos = factory.createHandlers(
  vValidator(
    "query",
    v.object({
      "last-name": v.optional(v.string()),
    }),
    vValidatorHook()
  ),
  async (c) => {
    const { "last-name": lastName } = c.req.valid("query");

    const db = drizzle(c.env.D1, { logger: true });
    const result = await findManyWithPage(db, { lastName });

    return c.render(<Montos {...result} />);
  }
);
