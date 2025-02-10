import * as v from "valibot";

export const genders = ["MAN", "WOMEN"] as const;
export type Gender = (typeof genders)[number];

const monto = v.object({
  gender: v.picklist(genders),
  firstName: v.string(),
  lastName: v.string(),
  phoneNumber: v.string(),
  address: v.string(),
  dateOfDeath: v.optional(v.date()),
  homyo: v.optional(v.string()),
  ingou: v.optional(v.string()),
});

export const unsavedMonto = monto;

export type UnsavedMonto = v.InferOutput<typeof unsavedMonto>;

export const savedMonto = v.intersect([
  monto,
  v.object({
    id: v.pipe(v.string(), v.uuid("The UUID is badly formatted.")),
  }),
]);

export type SavedHomyo = v.InferOutput<typeof savedMonto>;
