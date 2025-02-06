import { DrizzleD1Database } from "drizzle-orm/d1";
import { montos } from "./schema";

type FindManyWithPageResponse = {
  totalCount: number;
  values: {
    id: string;
  }[];
};

// TODO: implement me
export async function findManyWithPage(
  db: DrizzleD1Database
): Promise<FindManyWithPageResponse> {
  const result = await db.select().from(montos).all();
  return {
    totalCount: result.length,
    values: result,
  };
}
