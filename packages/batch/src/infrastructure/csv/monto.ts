import { parse } from "csv-parse/sync";
import { promises as fs } from "fs";
import * as v from "valibot";

const montoCsv = v.array(
  v.object({
    gender: v.union([v.literal("男"), v.literal("女")]),
  })
);

export async function generateMontosFromCsv(file: string) {
  const csv = await readCsv(file);
  const parsedMontoCsv = v.parse(montoCsv, csv);
  console.log(parsedMontoCsv);
}

async function readCsv(file: string): Promise<unknown> {
  const content = await fs.readFile(file);
  return parse(content, { columns: true }) as unknown;
}
