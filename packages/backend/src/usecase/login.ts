import {
  Administrator,
  compareAdministratorPassword,
} from "../model/administrator";
import { newSession } from "../model/session";
import { AuthError } from "./error";

export function Login(
  input: { userId: string; rawPassword: string },
  dependency: {
    getAdministrator: (id: string) => Administrator | null;
    saveToken: (token: string) => void;
  }
): {
  token: string;
  expiration: number;
} {
  const administrator = dependency.getAdministrator(input.userId);
  if (!administrator) {
    throw new AuthError("administrator not found");
  }

  if (compareAdministratorPassword(input.rawPassword, administrator)) {
    throw new AuthError("invalid raw password");
  }

  const session = newSession();
  return {
    token: session.token,
    expiration: session.expiration,
  };
}
