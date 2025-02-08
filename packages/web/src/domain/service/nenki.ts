import { addYears } from "date-fns";

export function calcNextNenki(dateOfDeath: Date): Date | undefined {
  const now = new Date();

  const yearsToAdd = [1, 2, 6, 13, 16, 24, 33, 50];
  for (const [idx, yearToAdd] of yearsToAdd.entries()) {
    const last = idx === yearsToAdd.length - 1;
    const nenki = addYears(dateOfDeath, yearToAdd);

    if (nenki >= now && !last) {
      return nenki;
    }
  }

  return void 0;
}

// in-source test suites
if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;
  describe("calcNextNenki", () => {
    it("Should return undefined after 50th", () => {
      const date = new Date("1970-01-10T15:00:00Z");
      const result = calcNextNenki(date);
      expect(result).toBeUndefined();
    });
  });
}
