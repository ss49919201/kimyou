import {
  InactiveMontoReason,
  inactiveSavedMonto,
  SavedMonto,
} from "../domain/model/monto";
import { InvalidParameterError } from "./error/invalidPrameter";
import { NotFoundError } from "./error/notFound";

export type Input = {
  id: string;
  reason: InactiveMontoReason;
};

export type Dependency = {
  findMonto: (id: string) => Promise<SavedMonto | undefined>;
  updateMonto: (savedMonto: SavedMonto) => Promise<void>;
};

export async function removeMonto(
  input: Input,
  dep: Dependency
): Promise<void> {
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
