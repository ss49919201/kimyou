import { eq, like } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { Gender, isGender } from "../../../domain/model/monto";
import { calcNextNenki } from "../../../domain/service/nenki";
import { buddhistProfiles, genders, montos } from "./schema";

type FindManyMontosWithPageResponse = {
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
    gender: Gender;
  }[];
};

type FindManyMontosWithPageParameters = {
  lastName?: string;
};

export async function findManyMontosWithPage(
  db: DrizzleD1Database,
  params: FindManyMontosWithPageParameters
): Promise<FindManyMontosWithPageResponse> {
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
    values: results.map((result) => {
      if (!isGender(result.genders.type)) {
        throw new Error(`Invalid gender type: ${result.genders.type}`);
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
        gender: result.genders.type,
        phoneNumber: result.montos.phoneNumber,
      };
    }),
  };
}

type FindOneMontoResponse = {
  id: string;
  homyo?: string;
  firstName: string;
  lastName: string;
  ingou?: string;
  dateOfDeath?: Date;
  nextNenki?: Date;
  address: string;
  phoneNumber: string;
  gender: Gender;
};

type FindOneMontoParameters = {
  id: string;
};

export async function findOneMonto(
  db: DrizzleD1Database,
  params: FindOneMontoParameters
): Promise<FindOneMontoResponse | undefined> {
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

  if (!isGender(result.genders.type)) {
    throw new Error(`Invalid gender type: ${result.genders.type}`);
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
