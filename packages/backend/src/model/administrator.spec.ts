import { hash } from "bcrypt";
import { describe, expect, it } from "vitest";
import { Administrator, compareAdministratorPassword } from "./administrator";

describe("compareAdministratorPassword", () => {
  it("Should return true if the password matches", async () => {
    const rawPassword = "password";
    const administrator: Administrator = {
      id: "2884842e-5e8d-4b7b-8a06-57f78f1f27ce",
      hasedPassword: await hash(rawPassword, 10),
    };

    expect(compareAdministratorPassword(rawPassword, administrator)).toBe(true);
  });
});
