import { eq } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { locks } from "./schema";

/**
 * @description
 * Return false if already locked.
 */
export async function lock(
  db: DrizzleD1Database,
  key: string
): Promise<boolean> {
  return await db
    .insert(locks)
    .values({
      key,
      lockedDate: new Date().toISOString(),
    })
    .then(() => true)
    .catch((e: unknown) => {
      // D1 does not throw extended error class when unique constraint error occurs.
      if (
        e instanceof Error &&
        e.message ===
          "D1_ERROR: UNIQUE constraint failed: locks.key: SQLITE_CONSTRAINT"
      ) {
        return false;
      }

      throw e;
    });
}

export async function unlock(
  db: DrizzleD1Database,
  key: string
): Promise<void> {
  await db.delete(locks).where(eq(locks.key, key));
}
