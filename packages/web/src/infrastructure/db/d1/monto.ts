import { eq, like } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { calcNextNenki } from "../../../domain/service/nenki";
import { buddhistProfiles, genders, montos } from "./schema";

type FindManyWithPageResponse = {
  totalCount: number;
  values: {
    id: string;
    homyo: string;
    firstName: string;
    lastName: string;
    ingou: string;
    dateOfDeath?: Date;
    nextNenki?: Date;
    address: string;
    phoneNumber?: string;
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
      homyo: result.buddhist_profiles?.homyo || "",
      firstName: result.montos.firstName,
      lastName: result.montos.lastName,
      ingou: result.buddhist_profiles?.ingou ?? "",
      dateOfDeath: result.montos.dateOfDeath
        ? new Date(result.montos.dateOfDeath)
        : undefined,
      address: result.montos.address ?? "",
      nextNenki: result.montos.dateOfDeath
        ? calcNextNenki(new Date(result.montos.dateOfDeath))
        : undefined,
      gender: result.genders.type,
      phoneNumber: result.montos.phoneNumber ?? undefined,
    })),
  };
}

type FindOneResponse = {
  id: string;
  homyo: string;
  firstName: string;
  lastName: string;
  ingou: string;
  dateOfDeath?: Date;
  nextNenki?: Date;
  address: string;
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
    .leftJoin(buddhistProfiles, eq(montos.id, buddhistProfiles.montoId))
    .where(eq(montos.id, params.id))
    .get();

  if (!result) {
    return undefined;
  }

  return {
    id: result.montos.id,
    homyo: result.buddhist_profiles?.homyo || "",
    firstName: result.montos.firstName,
    lastName: result.montos.lastName,
    ingou: result.buddhist_profiles?.ingou ?? "",
    dateOfDeath: result.montos.dateOfDeath
      ? new Date(result.montos.dateOfDeath)
      : undefined,
    address: result.montos.address ?? "",
    nextNenki: result.montos.dateOfDeath
      ? calcNextNenki(new Date(result.montos.dateOfDeath))
      : undefined,
  };
}
