import { drizzle } from "drizzle-orm/d1";
import { releaseLock } from "./releaseLock";

type Env = {
  ENV: string;
  D1: D1Database;
};

export default {
  async scheduled(_: ScheduledEvent, env: Env) {
    try {
      await releaseLock(drizzle(env.D1, { logger: true }));
    } catch (e: unknown) {
      console.error(e);
      throw e;
    }
  },
};
