import * as v from "valibot";

export class InvalidMontoError extends Error {
  type = "InvalidMonto";
  readonly details?: string;

  constructor(msg: string, details?: string) {
    if (details) {
      msg += ` details: ${details}`;
    }
    super(msg);
    this.details = details;
  }
}

export class InvalidMontoParameterError extends Error {
  type = "InvalidMontoParameter";
  readonly details?: string;

  constructor(msg: string, details?: string) {
    if (details) {
      msg += ` details: ${details}`;
    }
    super(msg);
    this.details = details;
  }
}

export const genders = ["MALE", "FEMALE"] as const;
const genderSchema = v.picklist(genders);
export type Gender = (typeof genders)[number];
export function isGender(s: string): s is Gender {
  return genders.includes(s as Gender);
}

export const montoStatus = ["ACTIVE", "INACTIVE"] as const;
export type MontoStatus = (typeof montoStatus)[number];
export function isMontoStatus(s: string): s is MontoStatus {
  return montoStatus.includes(s as MontoStatus);
}

export const inactiveMontoReason = [
  "TEMPLE_TRANSFER",
  "MISREGISTRATION",
  "OTHERS",
] as const;
export type InactiveMontoReason = (typeof inactiveMontoReason)[number];
export function isInactiveMontoReason(s: string): s is InactiveMontoReason {
  return inactiveMontoReason.includes(s as InactiveMontoReason);
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

  describe("isMontoStatus", () => {
    it("Should return true", () => {
      expect(isMontoStatus("ACTIVE")).toBe(true);
      expect(isMontoStatus("INACTIVE")).toBe(true);
    });
    it("Should return false", () => {
      expect(isMontoStatus("MAN")).toBe(false);
      expect(isMontoStatus("WOMAN")).toBe(false);
    });
  });

  describe("isInactiveMontoReason", () => {
    it("Should return true", () => {
      expect(isInactiveMontoReason("OTHERS")).toBe(true);
      expect(isInactiveMontoReason("TEMPLE_TRANSFER")).toBe(true);
      expect(isInactiveMontoReason("MISREGISTRATION")).toBe(true);
    });
    it("Should return false", () => {
      expect(isMontoStatus("MAN")).toBe(false);
      expect(isMontoStatus("WOMAN")).toBe(false);
    });
  });
}

// - Domestic prefix “0”
// - Area code + local code “total 5 digits”
// - Subscriber number “4 digits
// https://www.soumu.go.jp/main_sosiki/joho_tsusin/top/tel_number/q_and_a.html
const landlinePhoneNumberRegex = v.regex(
  /^0[0-9]{5}[0-9]{4}$/,
  "invalid phone nubmer format"
);

// 11-digit number starting with either 070, 080, or 090
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
    v.minLength(1, "first name length must be greater than equal 1")
  ),
  lastName: v.pipe(
    v.string("invalid last name length"),
    v.trim(),
    v.minLength(1, "last name length must be greater than equal 1")
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
    v.minLength(1, "address length must be greater than equal 1")
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
  // The regular expression for Kanji characters is [CJK統合漢字](https://ja.wikipedia.org/wiki/CJK%E7%B5%B1%E5%90%88%E6%BC%A2%E5%AD%97)
  homyo: v.optional(
    v.pipe(
      v.string("invalid homyo type"),
      v.trim(),
      v.regex(/^釋[\u4E00-\u9FFF]{2}$/, "invalid homyo format")
    )
  ),
  //The regular expression for Kanji characters is [CJK統合漢字](https://ja.wikipedia.org/wiki/CJK%E7%B5%B1%E5%90%88%E6%BC%A2%E5%AD%97)
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
    return new InvalidMontoParameterError(
      `Failed to parse input based on unsaved monto schema: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`
    );
  }
}

export type UnsavedMonto = v.InferOutput<typeof unsavedMontoSchema>;

const montoIdSchema = v.pipe(
  v.string(),
  v.uuid("The UUID is badly formatted.")
);

export const activeMontoSchema = v.pipe(
  v.intersect([
    validatedMontoSchema,
    v.object({
      id: montoIdSchema,
      status: v.literal("ACTIVE"),
    }),
  ]),
  v.brand("activeMonto"),
  v.readonly()
);

export type ActiveMonto = v.InferOutput<typeof activeMontoSchema>;

const inactiveMontoReasonSchema = v.picklist(inactiveMontoReason);

export const inactiveMontoSchema = v.pipe(
  v.intersect([
    validatedMontoSchema,
    v.object({
      id: montoIdSchema,
      status: v.literal("INACTIVE"),
      reason: inactiveMontoReasonSchema,
    }),
  ]),
  v.brand("inactiveMonto"),
  v.readonly()
);

export type InactiveMonto = v.InferOutput<typeof inactiveMontoSchema>;

export const savedMontoSchema = v.union([
  activeMontoSchema,
  inactiveMontoSchema,
]);

export type SavedMonto = v.InferOutput<typeof savedMontoSchema>;

export function newSavedMonto(
  input: v.InferInput<typeof savedMontoSchema>
): SavedMonto | Error {
  try {
    return v.parse(savedMontoSchema, input);
  } catch (e: unknown) {
    return new InvalidMontoError(
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
    return new InvalidMontoParameterError(
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
    return new InvalidMontoError(
      `Failed to parse input based on saved monto schema: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`
    );
  }

  return updatedMonto;
}

export function inactiveSavedMonto(
  currentMonto: v.InferOutput<typeof activeMontoSchema>,
  reason: v.InferOutput<typeof inactiveMontoReasonSchema>
): InactiveMonto | Error {
  let parsedReason: v.InferOutput<typeof inactiveMontoReasonSchema>;
  try {
    parsedReason = v.parse(inactiveMontoReasonSchema, reason);
  } catch (e: unknown) {
    return new InvalidMontoParameterError(
      `Failed to parse input based on inactive monto reason schema: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`
    );
  }

  const newStatus: MontoStatus = "INACTIVE";
  let inactiveMonto: v.InferOutput<typeof inactiveMontoSchema>;
  try {
    inactiveMonto = v.parse(inactiveMontoSchema, {
      ...currentMonto,
      reason: parsedReason,
      status: newStatus,
    });
  } catch (e: unknown) {
    return new InvalidMontoError(
      `Failed to parse input based on inactive monto schema: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`
    );
  }

  return inactiveMonto;
}

export function activeSavedMonto(
  currentMonto: v.InferOutput<typeof inactiveMontoSchema>
): ActiveMonto | Error {
  const newStatus: MontoStatus = "ACTIVE";
  let activeMonto: v.InferOutput<typeof activeMontoSchema>;
  try {
    activeMonto = v.parse(activeMontoSchema, {
      ...currentMonto,
      status: newStatus,
    });
  } catch (e: unknown) {
    return new InvalidMontoError(
      `Failed to parse input based on inactive monto schema: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`
    );
  }

  return activeMonto;
}
