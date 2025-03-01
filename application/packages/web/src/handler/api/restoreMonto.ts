import { factory } from "../factory";

export const restoreMonto = factory.createHandlers(async (c) => {
  return c.json({ msg: "ok" });
});
