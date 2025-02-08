import { addYears } from "date-fns";

export function calcNextNenki(dateOfDeath: Date): Date | undefined {
  const now = new Date();

  const yearsToAdd = [1, 2, 6, 13, 16, 24, 33, 50];
  for (const [idx, yearToAdd] of yearsToAdd.entries()) {
    const last = idx === yearsToAdd.length - 1;
    const nenki = addYears(dateOfDeath, yearToAdd);

    if (now >= nenki && !last) {
      return nenki;
    }
  }

  return void 0;
}
