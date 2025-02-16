import { eq, like } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { randomUUID } from "node:crypto";
import { UnsavedMonto } from "../../../domain/model/monto";
import { calcNextNenki } from "../../../domain/service/nenki";
import { buddhistProfiles, genders, montos } from "./schema";

type FindManyWithPageResponse = {
  totalCount: number;
  values: {
    id: string;
    homyo?: string;
    firstName: string;
    lastName: string;
    ingou?: string;
    dateOfDeath?: Date;
    nextNenki?: Date;
    address: string;
    phoneNumber: string;
    gender: string;
  }[];
};

type FindManyWithPageParameters = {
  lastName?: string;
};

export async function findManyWithPage(
  db: DrizzleD1Database,
  params: FindManyWithPageParameters
): Promise<FindManyWithPageResponse> {
  const query = db
    .select()
    .from(montos)
    .innerJoin(genders, eq(montos.genderId, genders.id))
    .leftJoin(buddhistProfiles, eq(montos.id, buddhistProfiles.montoId))
    .$dynamic();

  if (params.lastName) {
    query.where(like(montos.lastName, `%${params.lastName}%`));
  }

  const results = await query;

  return {
    totalCount: results.length,
    values: results.map((result) => ({
      id: result.montos.id,
      homyo: result.buddhist_profiles?.homyo ?? undefined,
      firstName: result.montos.firstName,
      lastName: result.montos.lastName,
      ingou: result.buddhist_profiles?.ingou ?? undefined,
      dateOfDeath: result.montos.dateOfDeath
        ? new Date(result.montos.dateOfDeath)
        : undefined,
      address: result.montos.address,
      nextNenki: result.montos.dateOfDeath
        ? calcNextNenki(new Date(result.montos.dateOfDeath))
        : undefined,
      gender: result.genders.type,
      phoneNumber: result.montos.phoneNumber,
    })),
  };
}

type FindOneResponse = {
  id: string;
  homyo?: string;
  firstName: string;
  lastName: string;
  ingou?: string;
  dateOfDeath?: Date;
  nextNenki?: Date;
  address: string;
  phoneNumber: string;
  gender: string;
};

type FindOneParameters = {
  id: string;
};

export async function findOne(
  db: DrizzleD1Database,
  params: FindOneParameters
): Promise<FindOneResponse | undefined> {
  const result = await db
    .select()
    .from(montos)
    .innerJoin(genders, eq(montos.genderId, genders.id))
    .leftJoin(buddhistProfiles, eq(montos.id, buddhistProfiles.montoId))
    .where(eq(montos.id, params.id))
    .get();

  if (!result) {
    return undefined;
  }

  return {
    id: result.montos.id,
    homyo: result.buddhist_profiles?.homyo ?? undefined,
    firstName: result.montos.firstName,
    lastName: result.montos.lastName,
    ingou: result.buddhist_profiles?.ingou ?? undefined,
    dateOfDeath: result.montos.dateOfDeath
      ? new Date(result.montos.dateOfDeath)
      : undefined,
    address: result.montos.address,
    nextNenki: result.montos.dateOfDeath
      ? calcNextNenki(new Date(result.montos.dateOfDeath))
      : undefined,
    phoneNumber: result.montos.phoneNumber,
    gender: result.genders.type,
  };
}

export async function insertMonto(
  db: DrizzleD1Database,
  unsavedMonto: UnsavedMonto
): Promise<void> {
  const selectedGender = await db
    .select({ id: genders.id })
    .from(genders)
    .where(eq(genders.type, unsavedMonto.gender === "MAN" ? "男" : "女"))
    .get();

  if (!selectedGender) {
    throw new Error("gender not found");
  }

  const createdDate = new Date().toISOString();
  const updatedDate = new Date().toISOString();

  // NOTE: Cloudflare D1 transaction not supported
  // https://github.com/drizzle-team/drizzle-orm/issues/2463
  const montoId = randomUUID();
  await db.insert(montos).values({
    id: montoId,
    genderId: selectedGender.id,
    firstName: unsavedMonto.firstName,
    lastName: unsavedMonto.lastName,
    address: unsavedMonto.address,
    phoneNumber: unsavedMonto.phoneNumber,
    dateOfDeath: unsavedMonto.dateOfDeath
      ? unsavedMonto.dateOfDeath.toISOString()
      : null,
    createdDate,
    updatedDate,
  });

  await db.insert(buddhistProfiles).values({
    id: crypto.randomUUID(),
    montoId,
    homyo: unsavedMonto.homyo,
    ingou: unsavedMonto.ingou,
    createdDate,
    updatedDate,
  });
}
