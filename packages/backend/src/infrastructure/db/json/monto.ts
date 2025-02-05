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

const montoFamily = v.object({
  name: v.string(),
  address: v.string(),
  montoList: v.array(monto),
});

const manyMontoFamily = v.array(montoFamily);

type ManyMontoFamily = v.InferOutput<typeof manyMontoFamily>;

const jsonPath = "./src/infrastructure/db/json/monto.json";
let json: ManyMontoFamily;

function readJson(): ManyMontoFamily {
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

  const parsedJson = v.safeParse(manyMontoFamily, rawJson);

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
  values: manyMontoFamily,
});

type FindManyMontoWithPageOutput = v.InferOutput<
  typeof findManyMontoWithPageOutput
>;

// TODO: implement me
export function findManyMontoWithPage(
  input: FindManyMontoWithPageInput
): FindManyMontoWithPageOutput {
  const allMontoFamily = readJson();

  const values = allMontoFamily.filter(
    (montoFamily) =>
      (!input.firstName ||
        containsMatchedMontoFirstName(montoFamily, input.firstName)) &&
      (!input.lastName ||
        containsMatchedMontoLastName(montoFamily, input.lastName))
  );

  return {
    totalPage: 0,
    values: sliceByPage(values, input.page),
  };
}

function containsMatchedMontoFirstName(
  value: FindManyMontoWithPageOutput["values"][number],
  montoFirstName: string
): boolean {
  return !!value.montoList.find(
    ({ firstName }) => firstName === montoFirstName
  );
}

function containsMatchedMontoLastName(
  value: FindManyMontoWithPageOutput["values"][number],
  montoLastName: string
): boolean {
  return !!value.montoList.find(({ lastName }) => lastName === montoLastName);
}

function sliceByPage(
  values: FindManyMontoWithPageOutput["values"],
  page: number
): FindManyMontoWithPageOutput["values"] {
  return values.slice((page - 1) * 50, page * 50);
}
