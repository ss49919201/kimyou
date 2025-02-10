export const genders = ["MAN", "WOMEN"] as const;
export type Gender = (typeof genders)[number];

export type UnsavedMonto = {
  gender: Gender;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  dateOfDeath?: Date;
  homyo?: string;
  ingou?: string;
};

export type SavedHomyo = UnsavedMonto & {
  id: string;
};
