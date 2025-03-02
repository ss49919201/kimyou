import { describe, expect, it, vi } from "vitest";
import { Gender, UnsavedMonto } from "../domain/model/monto";
import { InvalidParameterError } from "./error/invalidPrameter";
import { Dependency, Input, insertManyMontos } from "./insertManyMontos";

describe("insertManyMontos", () => {
  // Mock dependencies
  const createMockDependency = (options?: {
    maxMontos?: number;
    insertMontoMock?: (unsavedMonto: UnsavedMonto) => Promise<void>;
  }): Dependency => ({
    insertMonto:
      options?.insertMontoMock || vi.fn().mockResolvedValue(undefined),
    maxNumberOfInsertableMontos: vi
      .fn()
      .mockReturnValue(options?.maxMontos || 10),
  });

  // Valid input data
  const validInput: Input = {
    wetRun: true,
    montos: [
      {
        gender: "MALE",
        firstName: "Test",
        lastName: "User",
        phoneNumber: "0311112222",
        address: "Test Address",
      },
      {
        gender: "FEMALE",
        firstName: "Test2",
        lastName: "User2",
        phoneNumber: "0311112222",
        address: "Test Address 2",
        dateOfDeath: new Date("2023-01-01"),
        homyo: "釋一宗",
        ingou: "帰命院",
      },
    ],
  };

  it("should successfully insert montos when wetRun is true", async () => {
    // Arrange
    const mockInsertMonto = vi.fn().mockResolvedValue(undefined);
    const dependency = createMockDependency({
      insertMontoMock: mockInsertMonto,
    });

    // Act
    await insertManyMontos(validInput, dependency);

    // Assert
    expect(mockInsertMonto).toHaveBeenCalledTimes(2);
    expect(dependency.maxNumberOfInsertableMontos).toHaveBeenCalledTimes(1);
  });

  it("should not insert montos when wetRun is false", async () => {
    // Arrange
    const mockInsertMonto = vi.fn().mockResolvedValue(undefined);
    const dependency = createMockDependency({
      insertMontoMock: mockInsertMonto,
    });
    const dryRunInput = { ...validInput, wetRun: false };

    // Mock console.log to verify it's called
    const consoleSpy = vi.spyOn(console, "log");

    // Act
    await insertManyMontos(dryRunInput, dependency);

    // Assert
    expect(mockInsertMonto).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();

    // Restore console.log
    consoleSpy.mockRestore();
  });

  it("should throw InvalidParameterError when montos size exceeds maximum", async () => {
    // Arrange
    const maxMontos = 1;
    const dependency = createMockDependency({ maxMontos });

    // Act & Assert
    await expect(insertManyMontos(validInput, dependency)).rejects.toThrow(
      InvalidParameterError
    );
  });

  it("should throw InvalidParameterError when a monto is invalid", async () => {
    // Arrange
    const dependency = createMockDependency();
    const invalidInput: Input = {
      wetRun: true,
      montos: [
        {
          gender: "INVALID_GENDER" as unknown as Gender, // Invalid gender
          firstName: "Test",
          lastName: "User",
          phoneNumber: "0311112222",
          address: "Test Address",
        },
      ],
    };

    // Act & Assert
    await expect(insertManyMontos(invalidInput, dependency)).rejects.toThrow(
      InvalidParameterError
    );
  });

  it("should throw Error when any insert operation fails", async () => {
    // Arrange
    const mockInsertMonto = vi
      .fn()
      .mockResolvedValueOnce(undefined) // First call succeeds
      .mockRejectedValueOnce(new Error("Insert failed")); // Second call fails

    const dependency = createMockDependency({
      insertMontoMock: mockInsertMonto,
    });

    // Act & Assert
    await expect(insertManyMontos(validInput, dependency)).rejects.toThrow();
    expect(mockInsertMonto).toHaveBeenCalledTimes(2);
  });
});
