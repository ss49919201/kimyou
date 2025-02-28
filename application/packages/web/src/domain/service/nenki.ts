import { addYears, isAfter } from "date-fns";

/**
 * @name nextNenki
 * @param dateOfDeath - The original date of death
 * @returns The calculated date, or undefined if current date is after next neki.
 * @description
 * Return nenki in the future that is closest to the current date and time.
 */
export function nextNenki(dateOfDeath: Date): Date | undefined {
  const now = new Date();
  const yearsToAdd = [1, 2, 6, 12, 16, 24, 32, 49];
  const nenkis = yearsToAdd.map((yearToAdd) =>
    addYears(dateOfDeath, yearToAdd)
  );
  return nenkis.find((nenki) => isAfter(nenki, now));
}

// in-source test suites
if (import.meta.vitest) {
  const { it, expect, describe, vi, beforeEach, afterEach } = import.meta
    .vitest;
  describe("nextNenki", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("Should return calculated date (1th)", () => {
      const dateOfDeath = new Date("1970-01-10T15:00:00Z");
      const oneMonthAfterDateOfDeath = new Date("1970-02-10T15:00:00Z");
      vi.setSystemTime(oneMonthAfterDateOfDeath);

      const result = nextNenki(dateOfDeath);
      expect(result).toEqual(new Date("1971-01-10T15:00:00Z"));
    });

    it("Should return calculated date (3th)", () => {
      const dateOfDeath = new Date("1970-01-10T15:00:00Z");
      const oneYearAfterDateOfDeath = new Date("1971-01-10T15:00:00Z");
      vi.setSystemTime(oneYearAfterDateOfDeath);

      const result = nextNenki(dateOfDeath);
      expect(result).toEqual(new Date("1972-01-10T15:00:00Z"));
    });

    it("Should return calculated date (50th)", () => {
      const dateOfDeath = new Date("1970-01-10T15:00:00Z");
      const thirtyTwoYearsAfterDateOfDeath = new Date("2002-01-10T15:00:00Z");
      vi.setSystemTime(thirtyTwoYearsAfterDateOfDeath);

      const result = nextNenki(dateOfDeath);
      expect(result).toEqual(new Date("2019-01-10T15:00:00Z"));
    });

    it("Should return undefined after 50th", () => {
      const dateOfDeath = new Date("1970-01-10T15:00:00Z");
      const fiftyYearsAfterDateOfDeath = new Date("2020-01-10T15:00:00Z");
      vi.setSystemTime(fiftyYearsAfterDateOfDeath);

      const result = nextNenki(dateOfDeath);
      expect(result).toBeUndefined();
    });
  });
}
