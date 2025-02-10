import { parse } from "csv-parse/sync";
import { promises as fs } from "fs";
import * as v from "valibot";

const montoCsv = v.array(
  v.object({
    性別: v.union([v.literal("男"), v.literal("女")]),
    名: v.string(),
    性: v.string(),
    電話番号: v.string(),
    住所: v.string(),
    命日: v.optional(v.string()),
    法名: v.optional(v.string()),
    院号: v.optional(v.string()),
  })
);

export async function generateMontosFromCsv(
  file: string
): Promise<v.InferOutput<typeof montoCsv>> {
  const csv = await readCsv(file);

  const parsedMontoCsv = v.safeParse(montoCsv, csv);
  if (!parsedMontoCsv.success) {
    throw new Error(
      `Failed to parse montos from csv: ${
        new v.ValiError(parsedMontoCsv.issues).message
      }`
    );
  }

  return parsedMontoCsv.output;
}

async function readCsv(file: string): Promise<unknown> {
  const content = await fs.readFile(file);
  return parse(content, { columns: true }) as unknown;
}
