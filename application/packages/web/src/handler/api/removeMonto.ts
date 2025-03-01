import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { inactiveMontoReason } from "../../domain/model/monto";
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
    return c.json({ msg: "ok" });
  }
);
