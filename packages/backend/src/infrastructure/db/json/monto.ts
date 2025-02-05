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

const manyMonto = v.array(monto);

type manyMonto = v.InferOutput<typeof manyMonto>;

const jsonPath = "./src/infrastructure/db/json/monto.json";
let json: manyMonto;

function readJson(): manyMonto {
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

  const parsedJson = v.safeParse(manyMonto, rawJson);

  if (!parsedJson.success) {
    const valiError = new v.ValiError(parsedJson.issues);
    throw new Error(
      `Failed to parse json based on monto schema: ${valiError.message}`
    );
  }

  json = parsedJson.output;
  return json;
}

const findManyMontoWithPageInput = v.object({
  page: v.pipe(v.number(), v.integer(), v.minValue(1)),
  firstName: v.nullable(v.pipe(v.string(), v.minLength(1))),
  lastName: v.nullable(v.pipe(v.string(), v.minLength(1))),
  dateOfDeath: v.nullable(
    v.pipe(
      v.string(),
      v.isoDate(),
      v.transform((input) => new Date(input))
    )
  ),
  homyo: v.nullable(v.pipe(v.string(), v.minLength(1))),
  ingou: v.nullable(v.pipe(v.string(), v.minLength(1))),
});

type FindManyMontoWithPageInput = v.InferOutput<
  typeof findManyMontoWithPageInput
>;

const findManyMontoWithPageOutput = v.object({
  totalPage: v.pipe(v.number(), v.integer(), v.minValue(0)),
  values: manyMonto,
});

type FindManyMontoWithPageOutput = v.InferOutput<
  typeof findManyMontoWithPageOutput
>;

// TODO: implement me
export function findManyMontoWithPage(
  input: FindManyMontoWithPageInput
): FindManyMontoWithPageOutput {
  return {
    totalPage: 0,
    values: [],
  };
}
