import * as v from "valibot";

export const genders = ["MAN", "WOMEN"] as const;
export type Gender = (typeof genders)[number];

// 国内プレフィックス「0」市外局番+市内局番「合計5桁」加入者番号「4桁」
// https://www.soumu.go.jp/main_sosiki/joho_tsusin/top/tel_number/q_and_a.html
const phoneNumberRegex = v.regex(
  /^0[0-9]{5}[0-9]{4}$/,
  "invalid phone nubmer format"
);

const validatedMonto = v.object({
  gender: v.picklist(genders),
  firstName: v.pipe(
    v.string("invalid firstName type"),
    v.trim(),
    v.minLength(1, "invalid first name length")
  ),
  lastName: v.pipe(
    v.string("invalid last name length"),
    v.trim(),
    v.minLength(1, "invalid last name length")
  ),
  phoneNumber: v.pipe(
    v.string("invalid phone number type"),
    v.trim(),
    phoneNumberRegex
  ),
  address: v.pipe(
    v.string("invalid address type"),
    v.trim(),
    v.minLength(1, "invalid address length")
  ),
  dateOfDeath: v.optional(
    v.pipe(
      v.date("invalid date of death type"),
      v.maxValue(new Date(), "invalid date of death value")
    )
  ),
  // 漢字の正規表現は[CJK統合漢字](https://ja.wikipedia.org/wiki/CJK%E7%B5%B1%E5%90%88%E6%BC%A2%E5%AD%97)
  homyo: v.optional(
    v.pipe(
      v.string("invalid homyo type"),
      v.trim(),
      v.regex(/^釋[\u4E00-\u9FFF]{2}$/, "invalid homyo format")
    )
  ),
  // 漢字の正規表現は[CJK統合漢字](https://ja.wikipedia.org/wiki/CJK%E7%B5%B1%E5%90%88%E6%BC%A2%E5%AD%97)
  ingou: v.optional(
    v.pipe(
      v.string("invlalid ingou type"),
      v.trim(),
      v.regex(/^[\u4E00-\u9FFF]{2}院$/, "invalid ingou format")
    )
  ),
});

// in-source test suites
if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;
  describe("validateMonto", () => {
    it("Should not to throw error", () => {
      expect(() =>
        v.parse(validatedMonto, {
          gender: genders[0],
          firstName: "テスト名",
          lastName: "テスト性",
          phoneNumber: "0311112222",
          address: "テスト住所",
          dateOfDeath: new Date("2020-12-31T15:00:00Z"),
          homyo: "釋一宗",
          ingou: "帰命院",
        })
      ).not.toThrowError();
    });
  });
}

export const unsavedMonto = validatedMonto;

export function createUnsavedMonto(
  input: v.InferInput<typeof unsavedMonto>
): UnsavedMonto | Error {
  try {
    return v.parse(unsavedMonto, input);
  } catch (e: unknown) {
    return new Error(
      `Failed to parse input based on unsaved monto schema: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`
    );
  }
}

export type UnsavedMonto = v.InferOutput<typeof unsavedMonto>;

export const savedMonto = v.intersect([
  unsavedMonto,
  v.object({
    id: v.pipe(v.string(), v.uuid("The UUID is badly formatted.")),
  }),
]);

export type SavedHomyo = v.InferOutput<typeof savedMonto>;
