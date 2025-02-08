import { eq, like } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { buddhistProfiles, montos } from "./schema";

type FindManyWithPageResponse = {
  totalCount: number;
  values: {
    id: string;
    homyo: string;
    firstName: string;
    lastName: string;
    ingou: string;
    dateOfDeath: string;
    address: string;
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
      dateOfDeath: result.montos.dateOfDeath ?? "",
      address: result.montos.address,
    })),
  };
}
