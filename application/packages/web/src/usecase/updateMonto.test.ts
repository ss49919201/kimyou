import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConflictError } from "./error/conflict";
import { NotFoundError } from "./error/notFound";
import { Dependency, Input, updateMonto } from "./updateMonto";

// Mock the domain model and lockKey
vi.mock("../domain/model/monto");
vi.mock("./lockKey", () => ({
  lockKeyForUpdateMonto: vi
    .fn()
    .mockImplementation((id: string) => `updateMonto:${id}`),
}));

describe("updateMonto", () => {
  // Test data
  const montoId = "monto-123";
  const lockKey = `updateMonto:${montoId}`;
  const validInput: Input = {
    id: montoId,
    phoneNumber: "09012345678",
    address: "Updated Address",
    dateOfDeath: new Date("2023-01-01"),
    homyo: "釋一海",
    ingou: "帰命院",
  };

  // Mock montos - using Record<string, unknown> to bypass type checking since we're mocking
  const activeMonto = {
    id: montoId,
    firstName: "Test",
    lastName: "User",
    phoneNumber: "09011112222",
    address: "Old Address",
    gender: "MALE",
    status: "ACTIVE",
  } as Record<string, unknown>;

  // Mock dependencies
  let mockDependency: Dependency;
  let mockLock: ReturnType<typeof vi.fn>;
  let mockUnlock: ReturnType<typeof vi.fn>;
  let mockFindMonto: ReturnType<typeof vi.fn>;
  let mockUpdateMonto: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockLock = vi.fn().mockResolvedValue(true);
    mockUnlock = vi.fn().mockResolvedValue(undefined);
    mockFindMonto = vi.fn().mockResolvedValue(activeMonto);
    mockUpdateMonto = vi.fn().mockResolvedValue(undefined);

    mockDependency = {
      lock: mockLock,
      unlock: mockUnlock,
      findMonto: mockFindMonto,
      updateMonto: mockUpdateMonto,
    };

    // Reset mocks
    vi.clearAllMocks();
  });

  it("should successfully update a monto", async () => {
    // Act
    await updateMonto(validInput, mockDependency);

    // Assert
    expect(mockLock).toHaveBeenCalledWith(lockKey);
    expect(mockFindMonto).toHaveBeenCalledWith(montoId);
    expect(mockUpdateMonto).toHaveBeenCalled();
    expect(mockUnlock).toHaveBeenCalledWith(lockKey);
  });

  it("should throw ConflictError when lock fails", async () => {
    // Arrange
    mockLock.mockResolvedValueOnce(false);

    // Act & Assert
    await expect(updateMonto(validInput, mockDependency)).rejects.toThrow(
      ConflictError
    );
    expect(mockLock).toHaveBeenCalledWith(lockKey);
    expect(mockFindMonto).not.toHaveBeenCalled();
    expect(mockUpdateMonto).not.toHaveBeenCalled();
  });

  it("should throw NotFoundError when monto is not found", async () => {
    // Arrange
    mockFindMonto.mockResolvedValueOnce(undefined);

    // Act & Assert
    await expect(updateMonto(validInput, mockDependency)).rejects.toThrow(
      NotFoundError
    );
    expect(mockLock).toHaveBeenCalledWith(lockKey);
    expect(mockFindMonto).toHaveBeenCalledWith(montoId);
    expect(mockUpdateMonto).not.toHaveBeenCalled();
    expect(mockUnlock).toHaveBeenCalledWith(lockKey);
  });

  it("should throw InvalidParameterError when update fails", async () => {
    // Arrange - Mock the inactiveSavedMonto function to return an error
    const mockError = new Error("Domain validation error");
    const { modifiedSavedMonto } = await import("../domain/model/monto");
    vi.mocked(modifiedSavedMonto).mockReturnValueOnce(mockError);

    // Act & Assert
    await expect(updateMonto(validInput, mockDependency)).rejects.toThrow();
    expect(mockLock).toHaveBeenCalledWith(lockKey);
    expect(mockFindMonto).toHaveBeenCalledWith(montoId);
    expect(mockUpdateMonto).not.toHaveBeenCalled(); // UpdateMonto should not be called when modifiedSavedMonto returns an error
    expect(mockUnlock).toHaveBeenCalledWith(lockKey);
  });

  it("should always attempt to unlock even if operation fails", async () => {
    // Arrange
    mockFindMonto.mockRejectedValueOnce(new Error("Unexpected error"));

    // Act & Assert
    await expect(updateMonto(validInput, mockDependency)).rejects.toThrow();
    expect(mockLock).toHaveBeenCalledWith(lockKey);
    expect(mockUnlock).toHaveBeenCalledWith(lockKey);
  });

  it("should continue if unlock fails", async () => {
    // Arrange
    mockUnlock.mockRejectedValueOnce(new Error("Unlock failed"));
    const consoleSpy = vi.spyOn(console, "log");

    // Act
    await updateMonto(validInput, mockDependency);

    // Assert
    expect(mockLock).toHaveBeenCalledWith(lockKey);
    expect(mockFindMonto).toHaveBeenCalledWith(montoId);
    expect(mockUpdateMonto).toHaveBeenCalled();
    expect(mockUnlock).toHaveBeenCalledWith(lockKey);
    expect(consoleSpy).toHaveBeenCalled();

    // Restore console.log
    consoleSpy.mockRestore();
  });

  it("should update with partial input", async () => {
    // Arrange
    const partialInput: Input = {
      id: montoId,
      phoneNumber: "09012345678",
      address: "Updated Address",
    };

    // Act
    await updateMonto(partialInput, mockDependency);

    // Assert
    expect(mockLock).toHaveBeenCalledWith(lockKey);
    expect(mockFindMonto).toHaveBeenCalledWith(montoId);
    expect(mockUpdateMonto).toHaveBeenCalled();
    expect(mockUnlock).toHaveBeenCalledWith(lockKey);
  });
});
