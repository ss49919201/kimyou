import { SavedMonto, updateSavedMonto } from "../domain/model/monto";
import { InvalidParameterError } from "./error/invalidPrameter";
import { NotFoundError } from "./error/notFound";

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
};

export async function updateMonto(
  input: Input,
  dep: Dependency
): Promise<void> {
  const monto = await dep.findMonto(input.id);
  if (!monto) {
    throw new NotFoundError("monto not found");
  }

  const updatedMontoOrError = updateSavedMonto(monto, {
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
