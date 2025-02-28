import * as v from "valibot";

export const genders = ["MALE", "FEMALE"] as const;
const genderSchema = v.picklist(genders);
export type Gender = (typeof genders)[number];
export function isGender(s: string): s is Gender {
  return genders.includes(s as Gender);
}

// in-source test suites
if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;
  describe("isGender", () => {
    it("Should return true", () => {
      expect(isGender("MALE")).toBe(true);
      expect(isGender("FEMALE")).toBe(true);
    });
    it("Should return false", () => {
      expect(isGender("MAN")).toBe(false);
      expect(isGender("WOMAN")).toBe(false);
    });
  });
}

// 固定電話
// 国内プレフィックス「0」市外局番+市内局番「合計5桁」加入者番号「4桁」
// https://www.soumu.go.jp/main_sosiki/joho_tsusin/top/tel_number/q_and_a.html
const landlinePhoneNumberRegex = v.regex(
  /^0[0-9]{5}[0-9]{4}$/,
  "invalid phone nubmer format"
);

// 携帯電話
// 「070」「080」「090」のいずれかから始まる「11桁」の番号
// https://www.soumu.go.jp/main_sosiki/joho_tsusin/top/tel_number/q_and_a.html
const mobilePhoneNumberRegex = v.regex(
  /^0[789]0[0-9]{8}$/,
  "invalid phone nubmer format"
);

const validatedMontoSchema = v.object({
  gender: v.pipe(v.string(), genderSchema),
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
  phoneNumber: v.union([
    v.pipe(
      v.string("invalid phone number type"),
      v.trim(),
      landlinePhoneNumberRegex
    ),
    v.pipe(
      v.string("invalid phone number type"),
      v.trim(),
      mobilePhoneNumberRegex
    ),
  ]),
  address: v.pipe(
    v.string("invalid address type"),
    v.trim(),
    v.minLength(1, "invalid address length")
  ),
  dateOfDeath: v.optional(
    v.pipe(
      v.date("invalid date of death type"),
      // In Cloud flare workers, `new Date()` in global scope returns 0 value.
      // If `v.maxValue()` is used, the maximum value is `1970-01-01T00:00:00.000Z`
      v.custom(
        (input) => input instanceof Date && input <= new Date(),
        "date of death value must be less than equal current date"
      )
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
        v.parse(validatedMontoSchema, {
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

export const unsavedMontoSchema = v.pipe(
  validatedMontoSchema,
  v.brand("unsavedMonto"),
  v.readonly()
);

export function newUnsavedMonto(
  input: v.InferInput<typeof unsavedMontoSchema>
): UnsavedMonto | Error {
  try {
    return v.parse(unsavedMontoSchema, input);
  } catch (e: unknown) {
    return new Error(
      `Failed to parse input based on unsaved monto schema: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`
    );
  }
}

export type UnsavedMonto = v.InferOutput<typeof unsavedMontoSchema>;

export const savedMontoSchema = v.pipe(
  v.intersect([
    validatedMontoSchema,
    v.object({
      id: v.pipe(v.string(), v.uuid("The UUID is badly formatted.")),
    }),
  ]),
  v.brand("savedMonto"),
  v.readonly()
);

export function newSavedMonto(
  input: v.InferInput<typeof savedMontoSchema>
): SavedMonto | Error {
  try {
    return v.parse(savedMontoSchema, input);
  } catch (e: unknown) {
    return new Error(
      `Failed to parse input based on saved monto schema: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`
    );
  }
}

const modifiedSavedMontoInputSchema = v.omit(validatedMontoSchema, [
  "gender",
  "firstName",
  "lastName",
]);

export function modifiedSavedMonto(
  currentMonto: v.InferOutput<typeof savedMontoSchema>,
  input: v.InferInput<typeof modifiedSavedMontoInputSchema>
): SavedMonto | Error {
  let parsedInput: v.InferOutput<typeof modifiedSavedMontoInputSchema>;
  try {
    parsedInput = v.parse(modifiedSavedMontoInputSchema, input);
  } catch (e: unknown) {
    return new Error(
      `Failed to parse input based on update saved monto input schema: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`
    );
  }

  let updatedMonto: v.InferOutput<typeof savedMontoSchema>;
  try {
    updatedMonto = v.parse(savedMontoSchema, {
      ...currentMonto,
      phoneNumber: parsedInput.phoneNumber,
      address: parsedInput.address,
      dateOfDeath: parsedInput.dateOfDeath,
      homyo: parsedInput.homyo,
      ingou: parsedInput.ingou,
    });
  } catch (e: unknown) {
    return new Error(
      `Failed to parse input based on saved monto schema: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`
    );
  }

  return updatedMonto;
}

export type SavedMonto = v.InferOutput<typeof savedMontoSchema>;
