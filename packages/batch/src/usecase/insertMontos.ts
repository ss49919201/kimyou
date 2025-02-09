import * as v from "valibot";

export const input = v.object({
  file: v.pipe(v.string(), v.minLength(1)),
  wetRun: v.boolean(),
});

export type Input = v.InferInput<typeof input>;

export type Dependency = {};

export async function Do(input: Input, dep: Dependency): Promise<void> {}
