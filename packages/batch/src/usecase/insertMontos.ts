import * as v from "valibot";

export const input = v.object({
  file: v.pipe(v.string(), v.minLength(1)),
  wetRun: v.boolean(),
});

export type Input = v.InferInput<typeof input>;

export async function Do(input: Input): Promise<void> {}
