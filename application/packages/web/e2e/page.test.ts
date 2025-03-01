import { createExecutionContext, env } from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";
import worker from "../src";
import { dummyInvalidMontoId, dummyMontoId, setupD1 } from "./helper/d1";

describe("E2E Snapshot test", () => {
  beforeAll(async () => {
    await setupD1(env.D1, env.D1_MIGRATIONS);
  });

  it.each([
    { route: "/" },
    { route: "/homyos/generate" },
    { route: "/montos" },
    { route: `/montos/${dummyMontoId}` },
    { route: `/montos/${dummyMontoId}/edit` },
    { route: `/montos/${dummyInvalidMontoId}` },
    { route: "/montos/new" },
  ])("route `$route`", async ({ route }) => {
    const req = new Request(`http://localhost:8787"${route}`);
    const res = await worker.fetch(req, env, createExecutionContext());
    const resRext = await res.text();
    expect(resRext).toMatchSnapshot();
  });
});
