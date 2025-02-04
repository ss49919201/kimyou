import { readFileSync } from "fs";
import * as v from "valibot";

const monto = v.object({
  firstName: v.string(),
  lastName: v.string(),
  dateOfDeath: v.nullable(
    v.pipe(
      v.string(),
      v.isoDate(),
      v.transform((input) => new Date(input))
    )
  ),
  homyo: v.nullable(v.string()),
  ingou: v.nullable(v.string()),
});

type Monto = v.InferOutput<typeof monto>;

const jsonPath = "./src/infrastructure/db/json/monto.json";
let json: Monto;

function readJson(): Monto {
  if (json) {
    return json;
  }

  const buffer = readFileSync(
    "./src/infrastructure/db/json/monto.json",
    "utf-8"
  );

  let rawJson: unknown;
  try {
    rawJson = JSON.parse(buffer);
  } catch (e: unknown) {
    throw new Error(
      `${jsonPath} contains invalid json: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`
    );
  }

  const parsedJson = v.safeParse(monto, rawJson);

  if (!parsedJson.success) {
    const valiError = new v.ValiError(parsedJson.issues);
    throw new Error(
      `Failed to parse json based on monto schema: ${valiError.message}`
    );
  }

  json = parsedJson.output;
  return json;
}
