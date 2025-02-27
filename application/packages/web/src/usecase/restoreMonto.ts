import { SavedMonto, activeSavedMonto } from "../domain/model/monto";
import { InvalidParameterError } from "./error/invalidPrameter";
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
    throw new InvalidParameterError(
      "Invalid remove monto parameter",
      activeMontoOrError.message
    );
  }

  await dep.updateMonto(activeMontoOrError);
}
