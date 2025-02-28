import { Gender, newUnsavedMonto, UnsavedMonto } from "../domain/model/monto";
import { InvalidParameterError } from "./error/invalidPrameter";

export type Input = {
  wetRun: boolean;
  montos: {
    gender: Gender;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    dateOfDeath?: Date;
    homyo?: string;
    ingou?: string;
  }[];
};

export type Dependency = {
  insertMonto: (unsavedMonto: UnsavedMonto) => Promise<void>;
  maxNumberOfInsertableMontos: () => number;
};

export async function insertManyMontos(
  input: Input,
  dep: Dependency
): Promise<void> {
  const maxNumberOfInsertableMontos = dep.maxNumberOfInsertableMontos();
  if (input.montos.length > maxNumberOfInsertableMontos) {
    throw new InvalidParameterError(
      "Invalid montos size",
      `Montos size must be less than or equal to ${maxNumberOfInsertableMontos}, input montos size is ${input.montos.length}`
    );
  }

  const unsavedMontos = input.montos.map((inputMonto) => {
    const unsavedMontoOrError = newUnsavedMonto(inputMonto);
    if (unsavedMontoOrError instanceof Error) {
      throw new InvalidParameterError(
        "Invalid insert many montos parameter",
        unsavedMontoOrError.message
      );
    }
    return unsavedMontoOrError;
  });

  // TODO: improve error message...
  if (input.wetRun) {
    const results = await Promise.allSettled(
      unsavedMontos.map(async (unsavedMonto) => {
        try {
          await dep.insertMonto(unsavedMonto);
        } catch (e: unknown) {
          throw new Error(
            `Failed to insert, monto is ${JSON.stringify(
              unsavedMonto
            )}, error message is ${
              e instanceof Error ? e.message : JSON.stringify(e)
            }`
          );
        }
      })
    );

    const rejectedPromises = results.filter((p) => p.status === "rejected");
    if (rejectedPromises.length > 0) {
      const error = JSON.stringify({
        msg: "failed insert monto exists",
        detail: rejectedPromises.map(({ reason }) =>
          reason instanceof Error ? reason.message : JSON.stringify(reason)
        ),
      });
      throw new Error(error);
    }
  } else {
    console.log(`montos to be insert is :${JSON.stringify(unsavedMontos)}`);
  }
}
