import { randomUUID } from "crypto";
import { addDays } from "date-fns";
import * as v from "valibot";

const session = v.object({
  token: v.string(),
  expiration: v.number(),
});

export type Session = v.InferInput<typeof session>;

export function newSession(): Session {
  return {
    token: randomUUID(),
    expiration: addDays(new Date(), 1).valueOf(),
  };
}
