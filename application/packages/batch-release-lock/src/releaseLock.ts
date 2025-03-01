import { subSeconds } from "date-fns";
import { lte } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { locks } from "web/schema";

export async function releaseLock(db: DrizzleD1Database): Promise<void> {
  const before60s = subSeconds(new Date(), 60).toISOString();
  await db.delete(locks).where(lte(locks.lockedDate, before60s));
}
