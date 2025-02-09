import { program } from "commander";
import * as v from "valibot";

async function main() {
  program
    .arguments("<file>")
    .arguments("[wetRun]")
    .action(async (file, wetRun) => {
      const parsedFile = v.parse(v.string(), file);
      const parsedWetRun = !!v.parse(v.optional(v.boolean()), wetRun);

      console.log(parsedFile, parsedWetRun);
    });

  program.parse();
  console.log("Done");
}

main();
