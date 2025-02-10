import { UnsavedMonto } from "../domain/model/monto";

export type Input = {
  wetRun: boolean;
  mongos: {
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

export async function Do(input: Input, dep: Dependency): Promise<void> {}
