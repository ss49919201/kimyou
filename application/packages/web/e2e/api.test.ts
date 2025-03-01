import { createExecutionContext, env } from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";
import worker from "../src";
import { dummyMontoId, setupD1 } from "./helper/d1";

// TODO: Use side-effect results to assert test
describe("E2E API test", () => {
  beforeAll(async () => {
    await setupD1(env.D1, env.D1_MIGRATIONS);
  });

  const domain = "http://localhost:8787";

  it.each([
    {
      route: `/api/montos/${dummyMontoId}/restorations`,
      body: {},
    },
    {
      route: `/api/montos/${dummyMontoId}/removals`,
      body: {
        reason: "MISREGISTRATION",
      },
    },
    {
      route: "/api/montos/_batch",
      body: {
        wetRun: true,
        montos: [
          {
            firstName: "テスト",
            lastName: "太郎",
            phoneNumber: "0311112222",
            dateOfDeath: "2025-01-01T00:00:00Z",
            homyo: "釋一海",
            ingou: "帰命院",
            gender: "MALE",
            address: "大町",
          },
          {
            firstName: "テスト2",
            lastName: "太郎",
            phoneNumber: "0311112222",
            dateOfDeath: "2025-01-01T00:00:00Z",
            homyo: "釋一海",
            ingou: "帰命院",
            gender: "MALE",
            address: "大町",
          },
        ],
      },
    },
  ])("route `$route` POST", async ({ route, body }) => {
    const req = new Request(`${domain}${route}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });
    const res = await worker.fetch(req, env, createExecutionContext());
    expect(res.status).toBe(200);
  });
});
