import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Unstable_DevWorker } from "wrangler";
import { runWorker, stopWorker } from "./helper/worker";

describe("E2E Snapshot test", () => {
  let worker: Unstable_DevWorker;

  beforeAll(async () => {
    worker = await runWorker();
  });

  afterAll(async () => {
    await stopWorker(worker);
  });

  it.each([{ route: "/" }, { route: "/homyos/generate" }])(
    "route `$route`",
    async ({ route }) => {
      const res = await worker.fetch(route);
      expect(await res.text()).toMatchSnapshot();
    }
  );
});
