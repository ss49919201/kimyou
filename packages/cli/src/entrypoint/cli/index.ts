import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { findManyMontoFamilyWithPage } from "../../infrastructure/db/json/monto";

const readlineInterface = createInterface({
  input: stdin,
  output: stdout,
});

const main = async () => {
  console.log("==========================================");

  const firstName =
    (await readlineInterface.question("苗字を入力してください: ")) || null;

  const lastName =
    (await readlineInterface.question("名前を入力してください: ")) || null;

  const dateOfDeathStart =
    (await readlineInterface.question(
      "命日の期間開始日を入力してください: "
    )) || null;

  const dateOfDeathEnd = dateOfDeathStart
    ? (await readlineInterface.question("ページ番号を入力してください: ")) ||
      null
    : null;

  const homyo =
    (await readlineInterface.question("法名を入力してください: ")) || null;

  const ingou =
    (await readlineInterface.question("院号を入力してください: ")) || null;

  const page =
    (await readlineInterface.question("ページ番号を入力してください: ")) || 1;

  const result = findManyMontoFamilyWithPage({
    firstName,
    lastName,
    dateOfDeath:
      dateOfDeathStart && dateOfDeathEnd
        ? {
            start: dateOfDeathStart,
            end: dateOfDeathEnd,
          }
        : null,
    homyo,
    ingou,
    page: Number(page),
  });

  console.log("==========================================");
  console.log(JSON.stringify(result));

  readlineInterface.close();
};

main();
