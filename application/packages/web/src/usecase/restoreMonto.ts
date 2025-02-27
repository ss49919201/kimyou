import { SavedMonto, activeSavedMonto } from "../domain/model/monto";
import { NotFoundError } from "./error/notFound";

export type Input = {
  id: string;
};

export type Dependency = {
  findMonto: (id: string) => Promise<SavedMonto | undefined>;
  updateMonto: (savedMonto: SavedMonto) => Promise<void>;
};

export async function restoreMonto(
  input: Input,
  dep: Dependency
): Promise<void> {
  const monto = await dep.findMonto(input.id);
  if (!monto) {
    throw new NotFoundError("monto not found");
  }

  if (monto.status === "ACTIVE") {
    return;
  }

  const activeMontoOrError = activeSavedMonto(monto);
  if (activeMontoOrError instanceof Error) {
    // Should not throw InvalidParameterError because input has only id.
    throw activeMontoOrError;
  }

  await dep.updateMonto(activeMontoOrError);
}
