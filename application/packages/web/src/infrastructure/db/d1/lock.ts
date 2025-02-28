import { eq } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { locks } from "./schema";

export async function getLock(
  db: DrizzleD1Database,
  key: string
): Promise<void> {
  await db.insert(locks).values({
    key,
    lockedDate: new Date().toISOString(),
  });
}

export async function releaseLock(
  db: DrizzleD1Database,
  key: string
): Promise<void> {
  await db.delete(locks).where(eq(locks.key, key));
}
