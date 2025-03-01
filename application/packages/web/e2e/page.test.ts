import { createExecutionContext, env } from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";
import worker from "../src";
import { dummyInvalidMontoId, dummyMontoId, setupD1 } from "./helper/d1";

describe("E2E Page test", () => {
  beforeAll(async () => {
    await setupD1(env.D1, env.D1_MIGRATIONS);
  });

  const domain = "http://localhost:8787";

  it.each([
    { route: "/" },
    { route: "/homyos/generate" },
    { route: "/montos" },
    { route: `/montos/${dummyMontoId}` },
    { route: `/montos/${dummyMontoId}/edit` },
    { route: `/montos/${dummyInvalidMontoId}` },
    { route: "/montos/new" },
  ])("route `$route`", async ({ route }) => {
    const req = new Request(`${domain}${route}`);
    const res = await worker.fetch(req, env, createExecutionContext());
    const resRext = await res.text();
    expect(resRext).toMatchSnapshot();
  });

  it.each([
    {
      route: `/montos/${dummyMontoId}/edit`,
      formData: {
        "phone-number": "0311112222",
        "date-of-death": "2025-01-01",
        homyo: "釋一海",
        ingou: "帰命院",
        address: "大町",
      },
      expected: { redirectPath: "/montos" },
    },
    {
      route: "/montos/new",
      formData: {
        "first-name": "テスト",
        "last-name": "太郎",
        "phone-number": "0311112222",
        "date-of-death": "2025-01-01",
        homyo: "釋一海",
        ingou: "帰命院",
        gender: "MALE",
        address: "大町",
      },
      expected: { redirectPath: "/montos" },
    },
  ])("route `$route` POST", async ({ route, formData, expected }) => {
    const body = new FormData();
    for (const [name, value] of Object.entries(formData)) {
      body.append(name, value);
    }
    console.log(body);
    const req = new Request(`${domain}${route}`, {
      method: "POST",
      body,
      headers: { origin: domain },
    });
    const res = await worker.fetch(req, env, createExecutionContext());
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(expected.redirectPath);
  });
});
