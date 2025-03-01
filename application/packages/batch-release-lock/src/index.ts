import { drizzle } from "drizzle-orm/d1";
import { releaseLock } from "./releaseLock";

type Env = {
  ENV: string;
  D1: D1Database;
};

export default {
  async scheduled(event: ScheduledEvent, env: Env) {
    console.log({ scheduledTime: event.scheduledTime, cron: event.cron });

    try {
      await releaseLock(drizzle(env.D1, { logger: true }));
    } catch (e: unknown) {
      console.error(e);
      throw e;
    }
  },
};
