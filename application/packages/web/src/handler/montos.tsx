import Montos from "../pages/montos";
import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { drizzle } from "drizzle-orm/d1";
import { factory } from "./factory";
import { findManyMontosWithPage } from "../infrastructure/db/d1/montoReader";
import { vValidatorHook } from "./vValidator";

export const montos = factory.createHandlers(
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
    const result = await findManyMontosWithPage(db, { lastName });

    return c.render(<Montos {...result} />);
  }
);
