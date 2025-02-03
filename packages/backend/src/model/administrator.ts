import * as v from "valibot";

const administrator = v.object({
  id: v.string(),
  hasedPassword: v.string(),
});

export type Administrator = v.InferDefault<typeof administrator>;
