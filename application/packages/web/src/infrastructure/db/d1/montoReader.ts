import { eq, like } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { Gender, isGender } from "../../../domain/model/monto";
import { nextNenki } from "../../../domain/service/nenki";
import { activeMontos, buddhistProfiles, genders } from "./schema";

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
    .from(activeMontos)
    .innerJoin(genders, eq(activeMontos.genderId, genders.id))
    .leftJoin(buddhistProfiles, eq(activeMontos.id, buddhistProfiles.montoId))
    .$dynamic();

  if (params.lastName) {
    query.where(like(activeMontos.lastName, `%${params.lastName}%`));
  }

  const results = await query;

  return {
    totalCount: results.length,
    values: results.map((result) => {
      if (!isGender(result.genders.type)) {
        throw new Error(`Invalid gender type: ${result.genders.type}`);
      }

      return {
        id: result.active_montos.id,
        homyo: result.buddhist_profiles?.homyo ?? undefined,
        firstName: result.active_montos.firstName,
        lastName: result.active_montos.lastName,
        ingou: result.buddhist_profiles?.ingou ?? undefined,
        dateOfDeath: result.active_montos.dateOfDeath
          ? new Date(result.active_montos.dateOfDeath)
          : undefined,
        address: result.active_montos.address,
        nextNenki: result.active_montos.dateOfDeath
          ? nextNenki(new Date(result.active_montos.dateOfDeath))
          : undefined,
        gender: result.genders.type,
        phoneNumber: result.active_montos.phoneNumber,
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
    .from(activeMontos)
    .innerJoin(genders, eq(activeMontos.genderId, genders.id))
    .leftJoin(buddhistProfiles, eq(activeMontos.id, buddhistProfiles.montoId))
    .where(eq(activeMontos.id, params.id))
    .get();

  if (!result) {
    return undefined;
  }

  if (!isGender(result.genders.type)) {
    throw new Error(`Invalid gender type: ${result.genders.type}`);
  }

  return {
    id: result.active_montos.id,
    homyo: result.buddhist_profiles?.homyo ?? undefined,
    firstName: result.active_montos.firstName,
    lastName: result.active_montos.lastName,
    ingou: result.buddhist_profiles?.ingou ?? undefined,
    dateOfDeath: result.active_montos.dateOfDeath
      ? new Date(result.active_montos.dateOfDeath)
      : undefined,
    address: result.active_montos.address,
    nextNenki: result.active_montos.dateOfDeath
      ? nextNenki(new Date(result.active_montos.dateOfDeath))
      : undefined,
    phoneNumber: result.active_montos.phoneNumber,
    gender: result.genders.type,
  };
}
