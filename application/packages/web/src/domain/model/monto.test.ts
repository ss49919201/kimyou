import { describe, expect, it } from "vitest";
import {
  ActiveMonto,
  activeSavedMonto,
  InactiveMonto,
  InactiveMontoReason,
  inactiveSavedMonto,
  InvalidMontoError,
  InvalidMontoParameterError,
  modifiedSavedMonto,
  newSavedMonto,
  newUnsavedMonto,
} from "./monto";

describe("newUnsavedMonto", () => {
  it("should create UnsavedMonto with valid input", () => {
    const validInput = {
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
      dateOfDeath: new Date("2023-01-01"),
      homyo: "釋一宗",
      ingou: "帰命院",
    };

    const result = newUnsavedMonto(validInput);

    expect(result).not.toBeInstanceOf(Error);
    if (!(result instanceof Error)) {
      expect(result.gender).toBe("MALE");
      expect(result.firstName).toBe("太郎");
      expect(result.lastName).toBe("山田");
      expect(result.phoneNumber).toBe("0311112222");
      expect(result.address).toBe("東京都渋谷区");
      expect(result.dateOfDeath).toEqual(new Date("2023-01-01"));
      expect(result.homyo).toBe("釋一宗");
      expect(result.ingou).toBe("帰命院");
    }
  });

  it("should create UnsavedMonto without optional fields", () => {
    const validInput = {
      gender: "FEMALE",
      firstName: "花子",
      lastName: "鈴木",
      phoneNumber: "0311112222",
      address: "大阪府大阪市",
    };

    const result = newUnsavedMonto(validInput);

    expect(result).not.toBeInstanceOf(Error);
    if (!(result instanceof Error)) {
      expect(result.gender).toBe("FEMALE");
      expect(result.firstName).toBe("花子");
      expect(result.lastName).toBe("鈴木");
      expect(result.phoneNumber).toBe("0311112222");
      expect(result.address).toBe("大阪府大阪市");
      expect(result.dateOfDeath).toBeUndefined();
      expect(result.homyo).toBeUndefined();
      expect(result.ingou).toBeUndefined();
    }
  });

  it("should return error with invalid gender", () => {
    // Using type assertion to create an object with invalid gender for testing
    const invalidInput = {
      gender: "INVALID", // Invalid at runtime but passes type checking
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
    };

    const result = newUnsavedMonto(invalidInput);

    expect(result).toBeInstanceOf(InvalidMontoParameterError);
    if (result instanceof Error) {
      expect(result.message).toContain(
        "Failed to parse input based on unsaved monto schema"
      );
    }
  });

  it("should return error with empty first name", () => {
    const invalidInput = {
      gender: "MALE",
      firstName: "", // Empty first name
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
    };

    const result = newUnsavedMonto(invalidInput);

    expect(result).toBeInstanceOf(InvalidMontoParameterError);
    if (result instanceof Error) {
      expect(result.message).toContain(
        "Failed to parse input based on unsaved monto schema"
      );
    }
  });

  it("should return error with invalid phone number", () => {
    const invalidInput = {
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "123", // Invalid phone number
      address: "東京都渋谷区",
    };

    const result = newUnsavedMonto(invalidInput);

    expect(result).toBeInstanceOf(InvalidMontoParameterError);
    if (result instanceof Error) {
      expect(result.message).toContain(
        "Failed to parse input based on unsaved monto schema"
      );
    }
  });

  it("should return error with invalid homyo format", () => {
    const invalidInput = {
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
      homyo: "一宗", // Invalid homyo format (not starting with "釋")
    };

    const result = newUnsavedMonto(invalidInput);

    expect(result).toBeInstanceOf(InvalidMontoParameterError);
    if (result instanceof Error) {
      expect(result.message).toContain(
        "Failed to parse input based on unsaved monto schema"
      );
    }
  });

  it("should return error with invalid ingou format", () => {
    const invalidInput = {
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
      ingou: "帰命", // Invalid ingou format (not ending with "院")
    };

    const result = newUnsavedMonto(invalidInput);

    expect(result).toBeInstanceOf(InvalidMontoParameterError);
    if (result instanceof Error) {
      expect(result.message).toContain(
        "Failed to parse input based on unsaved monto schema"
      );
    }
  });

  it("should return error with future date of death", () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // Date one year in the future

    const invalidInput = {
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
      dateOfDeath: futureDate, // Future date
    };

    const result = newUnsavedMonto(invalidInput);

    expect(result).toBeInstanceOf(InvalidMontoParameterError);
    if (result instanceof Error) {
      expect(result.message).toContain(
        "Failed to parse input based on unsaved monto schema"
      );
    }
  });
});

describe("newSavedMonto", () => {
  it("should create ActiveMonto with valid input", () => {
    // Define the input with proper type annotations
    const validInput = {
      id: "123e4567-e89b-12d3-a456-426614174000", // Valid UUID
      status: "ACTIVE" as const,
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
      dateOfDeath: new Date("2023-01-01"),
      homyo: "釋一宗",
      ingou: "帰命院",
    };

    const result = newSavedMonto(validInput);

    expect(result).not.toBeInstanceOf(Error);
    if (!(result instanceof Error)) {
      expect(result.id).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(result.status).toBe("ACTIVE");
      expect(result.gender).toBe("MALE");
      expect(result.firstName).toBe("太郎");
      expect(result.lastName).toBe("山田");
      expect(result.phoneNumber).toBe("0311112222");
      expect(result.address).toBe("東京都渋谷区");
      expect(result.dateOfDeath).toEqual(new Date("2023-01-01"));
      expect(result.homyo).toBe("釋一宗");
      expect(result.ingou).toBe("帰命院");
    }
  });

  it("should create InactiveMonto with valid input", () => {
    // Define the input with proper type annotations
    const validInput = {
      id: "123e4567-e89b-12d3-a456-426614174000", // Valid UUID
      status: "INACTIVE" as const,
      reason: "OTHERS" as const,
      gender: "FEMALE",
      firstName: "花子",
      lastName: "鈴木",
      phoneNumber: "0311112222",
      address: "大阪府大阪市",
    };

    const result = newSavedMonto(validInput);

    expect(result).not.toBeInstanceOf(Error);
    if (!(result instanceof Error)) {
      expect(result.id).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(result.status).toBe("INACTIVE");
      expect((result as InactiveMonto).reason).toBe("OTHERS");
      expect(result.gender).toBe("FEMALE");
      expect(result.firstName).toBe("花子");
      expect(result.lastName).toBe("鈴木");
      expect(result.phoneNumber).toBe("0311112222");
      expect(result.address).toBe("大阪府大阪市");
    }
  });

  it("should return error with invalid UUID", () => {
    const invalidInput = {
      id: "invalid-uuid", // Invalid UUID format
      status: "ACTIVE" as const,
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
    };

    const result = newSavedMonto(invalidInput);

    expect(result).toBeInstanceOf(InvalidMontoError);
    if (result instanceof Error) {
      expect(result.message).toContain(
        "Failed to parse input based on saved monto schema"
      );
    }
  });
});

describe("modifiedSavedMonto", () => {
  it("should update ActiveMonto with valid input", () => {
    // Create a current ActiveMonto
    const currentMonto: ActiveMonto = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      status: "ACTIVE",
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
      dateOfDeath: new Date("2023-01-01"),
      homyo: "釋一宗",
      ingou: "帰命院",
    } as ActiveMonto;

    // Define the update input
    const updateInput = {
      phoneNumber: "0311112222", // Updated phone number
      address: "新宿区東京都", // Updated address
      dateOfDeath: new Date("2023-02-01"), // Updated date of death
      homyo: "釋二宗", // Updated homyo
      ingou: "浄土院", // Updated ingou
    };

    const result = modifiedSavedMonto(currentMonto, updateInput);

    expect(result).not.toBeInstanceOf(Error);
    if (!(result instanceof Error)) {
      // Original fields should remain unchanged
      expect(result.id).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(result.status).toBe("ACTIVE");
      expect(result.gender).toBe("MALE");
      expect(result.firstName).toBe("太郎");
      expect(result.lastName).toBe("山田");

      // Updated fields should reflect the new values
      expect(result.phoneNumber).toBe("0311112222");
      expect(result.address).toBe("新宿区東京都");
      expect(result.dateOfDeath).toEqual(new Date("2023-02-01"));
      expect(result.homyo).toBe("釋二宗");
      expect(result.ingou).toBe("浄土院");
    }
  });

  it("should update InactiveMonto with valid input", () => {
    // Create a current InactiveMonto
    const currentMonto: InactiveMonto = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      status: "INACTIVE",
      reason: "OTHERS",
      gender: "FEMALE",
      firstName: "花子",
      lastName: "鈴木",
      phoneNumber: "0311112222",
      address: "大阪府大阪市",
    } as InactiveMonto;

    // Define the update input
    const updateInput = {
      phoneNumber: "0312345678", // Updated phone number
      address: "京都府京都市", // Updated address
      homyo: "釋一宗", // New homyo
      ingou: "帰命院", // New ingou
    };

    const result = modifiedSavedMonto(currentMonto, updateInput);

    expect(result).not.toBeInstanceOf(Error);
    if (!(result instanceof Error)) {
      // Original fields should remain unchanged
      expect(result.id).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(result.status).toBe("INACTIVE");
      expect((result as InactiveMonto).reason).toBe("OTHERS");
      expect(result.gender).toBe("FEMALE");
      expect(result.firstName).toBe("花子");
      expect(result.lastName).toBe("鈴木");

      // Updated fields should reflect the new values
      expect(result.phoneNumber).toBe("0312345678");
      expect(result.address).toBe("京都府京都市");
      expect(result.homyo).toBe("釋一宗");
      expect(result.ingou).toBe("帰命院");
    }
  });

  it("should return error with invalid phone number", () => {
    // Create a current ActiveMonto
    const currentMonto: ActiveMonto = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      status: "ACTIVE",
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
    } as ActiveMonto;

    // Define an invalid update input
    const invalidInput = {
      phoneNumber: "123", // Invalid phone number
      address: "東京都新宿区",
    };

    const result = modifiedSavedMonto(currentMonto, invalidInput);

    expect(result).toBeInstanceOf(InvalidMontoParameterError);
    if (result instanceof Error) {
      expect(result.message).toContain(
        "Failed to parse input based on update saved monto input schema"
      );
    }
  });

  it("should return error with invalid homyo format", () => {
    // Create a current ActiveMonto
    const currentMonto: ActiveMonto = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      status: "ACTIVE",
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
    } as ActiveMonto;

    // Define an invalid update input
    const invalidInput = {
      phoneNumber: "0311112222",
      address: "東京都新宿区",
      homyo: "一宗", // Invalid homyo format (not starting with "釋")
    };

    const result = modifiedSavedMonto(currentMonto, invalidInput);

    expect(result).toBeInstanceOf(InvalidMontoParameterError);
    if (result instanceof Error) {
      expect(result.message).toContain(
        "Failed to parse input based on update saved monto input schema"
      );
    }
  });

  it("should return error with future date of death", () => {
    // Create a current ActiveMonto
    const currentMonto: ActiveMonto = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      status: "ACTIVE",
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
    } as ActiveMonto;

    // Create a future date
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // Date one year in the future

    // Define an invalid update input
    const invalidInput = {
      phoneNumber: "0311112222",
      address: "東京都新宿区",
      dateOfDeath: futureDate, // Future date is invalid
    };

    const result = modifiedSavedMonto(currentMonto, invalidInput);

    expect(result).toBeInstanceOf(InvalidMontoParameterError);
    if (result instanceof Error) {
      expect(result.message).toContain(
        "Failed to parse input based on update saved monto input schema"
      );
    }
  });
});

describe("inactiveSavedMonto", () => {
  it("should convert ActiveMonto to InactiveMonto with valid reason", () => {
    // Create a current ActiveMonto
    const activeMonto: ActiveMonto = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      status: "ACTIVE",
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
      dateOfDeath: new Date("2023-01-01"),
      homyo: "釋一宗",
      ingou: "帰命院",
    } as ActiveMonto;

    // Define a valid reason
    const reason: InactiveMontoReason = "OTHERS";

    const result = inactiveSavedMonto(activeMonto, reason);

    expect(result).not.toBeInstanceOf(Error);
    if (!(result instanceof Error)) {
      // Original fields should remain unchanged
      expect(result.id).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(result.gender).toBe("MALE");
      expect(result.firstName).toBe("太郎");
      expect(result.lastName).toBe("山田");
      expect(result.phoneNumber).toBe("0311112222");
      expect(result.address).toBe("東京都渋谷区");
      expect(result.dateOfDeath).toEqual(new Date("2023-01-01"));
      expect(result.homyo).toBe("釋一宗");
      expect(result.ingou).toBe("帰命院");

      // Status should be changed to INACTIVE
      expect(result.status).toBe("INACTIVE");
      // Reason should be set
      expect(result.reason).toBe("OTHERS");
    }
  });
});

describe("activeSavedMonto", () => {
  it("should convert InactiveMonto to ActiveMonto", () => {
    // Create a current InactiveMonto
    const inactiveMonto: InactiveMonto = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      status: "INACTIVE",
      reason: "OTHERS",
      gender: "MALE",
      firstName: "太郎",
      lastName: "山田",
      phoneNumber: "0311112222",
      address: "東京都渋谷区",
      dateOfDeath: new Date("2023-01-01"),
      homyo: "釋一宗",
      ingou: "帰命院",
    } as InactiveMonto;

    const result = activeSavedMonto(inactiveMonto);

    expect(result).not.toBeInstanceOf(Error);
    if (!(result instanceof Error)) {
      // Original fields should remain unchanged
      expect(result.id).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(result.gender).toBe("MALE");
      expect(result.firstName).toBe("太郎");
      expect(result.lastName).toBe("山田");
      expect(result.phoneNumber).toBe("0311112222");
      expect(result.address).toBe("東京都渋谷区");
      expect(result.dateOfDeath).toEqual(new Date("2023-01-01"));
      expect(result.homyo).toBe("釋一宗");
      expect(result.ingou).toBe("帰命院");

      // Status should be changed to ACTIVE
      expect(result.status).toBe("ACTIVE");
    }
  });
});
