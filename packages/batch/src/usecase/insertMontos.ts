import * as v from "valibot";
import { UnsavedMonto } from "../domain/model/monto";

const wetRun = v.boolean();

export const input = v.object({
  wetRun: wetRun,
  montos: v.array(
    v.object({
      gender: v.union([v.literal("男"), v.literal("女")]),
      firstName: v.string(),
      lastName: v.string(),
      phoneNumber: v.string(),
      address: v.string(),
      dateOfDeath: v.optional(v.string()),
      homyo: v.optional(v.string()),
      ingou: v.optional(v.string()),
    })
  ),
});

export type Input = v.InferInput<typeof input>;

export type Dependency = {
  insertMonto: (unsavedMonto: UnsavedMonto) => Promise<void>;
};

export async function Do(input: Input, dep: Dependency): Promise<void> {}
