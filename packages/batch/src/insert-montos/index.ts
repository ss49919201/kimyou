import { program } from "commander";
import * as v from "valibot";
import { UnsavedMonto } from "../domain/model/monto";
import { generateMontosFromCsv } from "../infrastructure/csv/monto";
import { insertMontos } from "../usecase/insertMontos";

async function main() {
  program
    .arguments("<file>")
    .arguments("[wetRun]")
    .action(async (file, wetRun) => {
      const parsedFile = v.parse(v.string(), file);
      const parsedWetRun = !!v.parse(v.optional(v.boolean()), wetRun);

      const montosFromCsv = await generateMontosFromCsv(parsedFile);

      await insertMontos(
        {
          wetRun: parsedWetRun,
          montos: montosFromCsv.map((monto) => ({
            gender: monto.性別 === "男" ? "MAN" : "WOMEN",
            firstName: monto.名,
            lastName: monto.性,
            phoneNumber: monto.電話番号,
            address: monto.住所,
            dateOfDeath: monto.命日 ? new Date(monto.命日) : undefined,
            homyo: monto.法名,
            ingou: monto.院号,
          })),
        },
        {
          // mock
          insertMonto: async (_: UnsavedMonto) => {},
        }
      );
    });

  program.parse();
}

main().catch((e: unknown) =>
  console.error(
    `Failed to exec insert montos: ${
      e instanceof Error ? e.message : JSON.stringify(e)
    }`
  )
);
