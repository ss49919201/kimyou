import { SavedMonto, activeSavedMonto } from "../domain/model/monto";
import { ConflictError } from "./error/conflict";
import { InvalidParameterError } from "./error/invalidPrameter";
import { NotFoundError } from "./error/notFound";
import { lockKeyForUpdateMonto } from "./lockKey";

export type Input = {
  id: string;
};

export type Dependency = {
  findMonto: (id: string) => Promise<SavedMonto | undefined>;
  updateMonto: (savedMonto: SavedMonto) => Promise<void>;
  lock: (key: string) => Promise<boolean>;
  unlock: (key: string) => Promise<void>;
};

export async function restoreMonto(
  input: Input,
  dep: Dependency
): Promise<void> {
  const lockKey = lockKeyForUpdateMonto(input.id);
  if (!(await dep.lock(lockKey))) {
    throw new ConflictError("Monto update alreacy locked.");
  }
  try {
    await _restoreMonto(input, dep);
  } finally {
    try {
      await dep.unlock(lockKey);
    } catch (e) {
      console.log(
        `Failed to unlock monto update, ${
          e instanceof Error ? e.message : JSON.stringify(e)
        }`
      );
    }
  }
}

async function _restoreMonto(input: Input, dep: Dependency): Promise<void> {
  const monto = await dep.findMonto(input.id);
  if (!monto) {
    throw new NotFoundError("monto not found");
  }

  if (monto.status === "ACTIVE") {
    return;
  }

  const activeMontoOrError = activeSavedMonto(monto);
  if (activeMontoOrError instanceof Error) {
    throw new InvalidParameterError(
      "Invalid remove monto parameter",
      activeMontoOrError.message
    );
  }

  await dep.updateMonto(activeMontoOrError);
}
