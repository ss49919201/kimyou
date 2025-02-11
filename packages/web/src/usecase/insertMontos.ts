import { createUnsavedMonto, UnsavedMonto } from "../domain/model/monto";

export type Input = {
  wetRun: boolean;
  montos: {
    gender: "MAN" | "WOMEN";
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
};

export async function insertMontos(
  input: Input,
  dep: Dependency
): Promise<void> {
  const unsavedMontos = input.montos.map(createUnsavedMonto);

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
