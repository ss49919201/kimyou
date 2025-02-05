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

const findManyMontoFamilyWithPageInput = v.object({
  page: v.pipe(v.number(), v.integer(), v.minValue(1)),
  firstName: v.nullable(v.pipe(v.string(), v.minLength(1))),
  lastName: v.nullable(v.pipe(v.string(), v.minLength(1))),
  dateOfDeath: v.nullable(
    v.object({
      start: v.pipe(
        v.string(),
        v.isoDate(),
        v.transform((input) => new Date(input))
      ),
      end: v.pipe(
        v.string(),
        v.isoDate(),
        v.transform((input) => new Date(input))
      ),
    })
  ),
  homyo: v.nullable(v.pipe(v.string(), v.minLength(1))),
  ingou: v.nullable(v.pipe(v.string(), v.minLength(1))),
});

type FindManyMontoFamilyWithPageInput = v.InferOutput<
  typeof findManyMontoFamilyWithPageInput
>;

const findManyMontoFamilyWithPageOutput = v.object({
  totalPage: v.pipe(v.number(), v.integer(), v.minValue(0)),
  values: manyMontoFamily,
});

type FindManyMontoFamilyWithPageOutput = v.InferOutput<
  typeof findManyMontoFamilyWithPageOutput
>;

// TODO: implement me
export function findManyMontoFamilyWithPage(
  input: FindManyMontoFamilyWithPageInput
): FindManyMontoFamilyWithPageOutput {
  const parsedInput = v.safeParse(findManyMontoFamilyWithPageInput, input);
  if (!parsedInput.success) {
    const valiError = new v.ValiError(parsedInput.issues);
    throw new Error(
      `Failed to parse json based on find many monto with page input schema: ${valiError.message}`
    );
  }
  const { firstName, lastName, dateOfDeath, homyo, ingou } = parsedInput.output;

  const allMontoFamily = readJson();
  const values = allMontoFamily.filter(
    (montoFamily) =>
      (!firstName || containsMatchedMontoFirstName(montoFamily, firstName)) &&
      (!lastName || containsMatchedMontoLastName(montoFamily, lastName)) &&
      (!dateOfDeath ||
        containsMatchedMontoDateOfDeath(montoFamily, dateOfDeath)) &&
      (!homyo || containsMatchedMontoHomyo(montoFamily, homyo)) &&
      (!ingou || containsMatchedMontoIngou(montoFamily, ingou))
  );

  return {
    totalPage: values.length,
    values: sliceByPage(values, input.page),
  };
}

function containsMatchedMontoFirstName(
  value: FindManyMontoFamilyWithPageOutput["values"][number],
  montoFirstName: string
): boolean {
  return !!value.montoList.find(
    ({ firstName }) => firstName === montoFirstName
  );
}

function containsMatchedMontoLastName(
  value: FindManyMontoFamilyWithPageOutput["values"][number],
  montoLastName: string
): boolean {
  return !!value.montoList.find(({ lastName }) => lastName === montoLastName);
}

function containsMatchedMontoDateOfDeath(
  value: FindManyMontoFamilyWithPageOutput["values"][number],
  {
    start,
    end,
  }: {
    start: Date;
    end: Date;
  }
): boolean {
  return !!value.montoList.find(({ dateOfDeath }) => {
    const dateOfDeathTimeValue = dateOfDeath?.valueOf();

    return (
      dateOfDeathTimeValue &&
      dateOfDeathTimeValue >= start.valueOf() &&
      dateOfDeathTimeValue <= end.valueOf()
    );
  });
}

function containsMatchedMontoHomyo(
  value: FindManyMontoFamilyWithPageOutput["values"][number],
  montoHomyo: string
): boolean {
  return !!value.montoList.find(({ homyo }) => homyo === montoHomyo);
}

function containsMatchedMontoIngou(
  value: FindManyMontoFamilyWithPageOutput["values"][number],
  montoIngou: string
): boolean {
  return !!value.montoList.find(({ ingou }) => ingou === montoIngou);
}

function sliceByPage(
  values: FindManyMontoFamilyWithPageOutput["values"],
  page: number
): FindManyMontoFamilyWithPageOutput["values"] {
  return values.slice((page - 1) * 50, page * 50);
}
