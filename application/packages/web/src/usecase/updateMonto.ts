import { SavedMonto, modifiedSavedMonto } from "../domain/model/monto";
import { ConflictError } from "./error/conflict";
import { InvalidParameterError } from "./error/invalidPrameter";
import { NotFoundError } from "./error/notFound";
import { lockKeyForUpdateMonto } from "./lockKey";

export type Input = {
  id: string;
  phoneNumber: string;
  address: string;
  dateOfDeath?: Date;
  homyo?: string;
  ingou?: string;
};

export type Dependency = {
  findMonto: (id: string) => Promise<SavedMonto | undefined>;
  updateMonto: (savedMonto: SavedMonto) => Promise<void>;
  lock: (key: string) => Promise<boolean>;
  unlock: (key: string) => Promise<void>;
};

export async function updateMonto(
  input: Input,
  dep: Dependency
): Promise<void> {
  const lockKey = lockKeyForUpdateMonto(input.id);
  if (!(await dep.lock(lockKey))) {
    throw new ConflictError("Monto update alreacy locked.");
  }
  try {
    await _updateMonto(input, dep);
  } finally {
    try {
      await dep.unlock(lockKey);
    } catch (e) {
      console.log(e);
    }
  }
}

async function _updateMonto(input: Input, dep: Dependency): Promise<void> {
  const monto = await dep.findMonto(input.id);
  if (!monto) {
    throw new NotFoundError("monto not found");
  }

  const updatedMontoOrError = modifiedSavedMonto(monto, {
    ...input,
  });
  if (updatedMontoOrError instanceof Error) {
    throw new InvalidParameterError(
      "Invalid update monto parameter",
      updatedMontoOrError.message
    );
  }

  await dep.updateMonto(updatedMontoOrError);
}
