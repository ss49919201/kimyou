import { TZDate } from "@date-fns/tz";

/**
 * @description
 * Create a Date instance from a JST date string.
 * ⚠️ JST date string format must be `yyyy-mm-dd`. Otherwise, it will return unexpected results.
 */
export function jstDateStrToDate(jstDate: string): Date {
  const yyyy = Number(jstDate.slice(0, 4));
  const MM = Number(jstDate.slice(5, 7)) - 1;
  const dd = Number(jstDate.slice(8, 10));
  return new Date(new TZDate(yyyy, MM, dd, "Asia/Tokyo"));
}

// in-source test suites
if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;
  describe("jstDateStrToDate", () => {
    it("Should return expected Date", () => {
      const expected = new Date("2025-01-10T15:00:00Z");

      expect(jstDateStrToDate("2025-01-11")).toEqual(expected);
    });

    it("Should return unexpected Date, if parameter format is inavlid", () => {
      const expected = new Date("2025-01-10T15:00:00Z");

      expect(jstDateStrToDate("20250111")).not.toEqual(expected);
    });
  });
}
