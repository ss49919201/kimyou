import { compareSync } from "bcrypt";
import * as v from "valibot";

const administrator = v.object({
  id: v.string(),
  hasedPassword: v.string(),
});

export type Administrator = v.InferInput<typeof administrator>;

export function compareAdministratorPassword(
  rawPassword: string,
  administrator: Administrator
) {
  return compareSync(rawPassword, administrator.hasedPassword);
}
