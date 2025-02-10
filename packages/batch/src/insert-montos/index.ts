import { program } from "commander";
import * as v from "valibot";
import { generateMontosFromCsv } from "../infrastructure/csv/monto";

async function main() {
  program
    .arguments("<file>")
    .arguments("[wetRun]")
    .action(async (file, wetRun) => {
      const parsedFile = v.parse(v.string(), file);
      const parsedWetRun = !!v.parse(v.optional(v.boolean()), wetRun);

      const montosFromCsv = await generateMontosFromCsv(parsedFile);

      console.log(montosFromCsv);
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
