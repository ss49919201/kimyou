import {
  InactiveMontoReason,
  inactiveSavedMonto,
  SavedMonto,
} from "../domain/model/monto";
import { ConflictError } from "./error/conflict";
import { InvalidParameterError } from "./error/invalidPrameter";
import { NotFoundError } from "./error/notFound";
import { lockKeyForUpdateMonto } from "./lockKey";

export type Input = {
  id: string;
  reason: InactiveMontoReason;
};

export type Dependency = {
  findMonto: (id: string) => Promise<SavedMonto | undefined>;
  updateMonto: (savedMonto: SavedMonto) => Promise<void>;
  lock: (key: string) => Promise<boolean>;
  unlock: (key: string) => Promise<void>;
};

export async function removeMonto(
  input: Input,
  dep: Dependency
): Promise<void> {
  const lockKey = lockKeyForUpdateMonto(input.id);
  if (!(await dep.lock(lockKey))) {
    throw new ConflictError("Monto update alreacy locked.");
  }
  try {
    await _removeMonto(input, dep);
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

async function _removeMonto(input: Input, dep: Dependency): Promise<void> {
  const monto = await dep.findMonto(input.id);
  if (!monto) {
    throw new NotFoundError("monto not found");
  }

  if (monto.status === "INACTIVE") {
    return;
  }

  const inactiveMontoOrError = inactiveSavedMonto(monto, input.reason);
  if (inactiveMontoOrError instanceof Error) {
    throw new InvalidParameterError(
      "Invalid remove monto parameter",
      inactiveMontoOrError.message
    );
  }

  await dep.updateMonto(inactiveMontoOrError);
}
