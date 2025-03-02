import { describe, expect, it } from "vitest";
import { lockKeyForUpdateMonto } from "./lockKey";

describe("lockKeyForUpdateMonto", () => {
  it("should return a formatted lock key string", () => {
    // Arrange
    const montoId = "123456";
    const expectedLockKey = "updateMonto:123456";

    // Act
    const result = lockKeyForUpdateMonto(montoId);

    // Assert
    expect(result).toBe(expectedLockKey);
  });

  it("should throw when id is empty string", () => {
    // Arrange
    const montoId = "";

    // Act & Assert
    expect(() => lockKeyForUpdateMonto(montoId)).toThrow();
  });
});
