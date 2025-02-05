import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { findManyMontoFamilyWithPage } from "../../infrastructure/db/json/monto";

const readlineInterface = createInterface({
  input: stdin,
  output: stdout,
});

const main = async () => {
  // TODO: implement other questions
  const page = await readlineInterface.question(
    "ページ番号を入力してください: "
  );

  const result = findManyMontoFamilyWithPage({
    page: Number(page),
    firstName: null,
    lastName: null,
    dateOfDeath: null,
    homyo: null,
    ingou: null,
  });

  console.log(result);
};

main();
