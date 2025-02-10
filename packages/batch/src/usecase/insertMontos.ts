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

  if (input.wetRun) {
    await Promise.all(
      unsavedMontos.map(
        async (unsavedMonto) => await dep.insertMonto(unsavedMonto)
      )
    );
  } else {
    console.log(`montos to be insert is :${JSON.stringify(unsavedMontos)}`);
  }
}
