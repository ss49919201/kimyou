import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Unstable_DevWorker } from "wrangler";
import { unstable_dev } from "wrangler";

describe("E2E Snapshot test", () => {
  let worker: Unstable_DevWorker;

  beforeAll(async () => {
    worker = await unstable_dev("./src/index.tsx", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it.each([{ route: "/" }, { route: "/homyos/generate" }])(
    "route `$route`",
    async ({ route }) => {
      const res = await worker.fetch(route);
      expect(await res.text()).toMatchSnapshot();
    }
  );
});
