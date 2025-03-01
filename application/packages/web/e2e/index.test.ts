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
    {
      route: "/montos/new",
      method: "POST",
      formData: {
        gender: "MALE",
        address: "address",
        "first-name": "fn",
        "last-name": "ln",
        "phone-number": "0311112222",
        "date-of-death": "2025-01-01",
        homyo: "釋一宗",
        ingou: "帰命院",
      },
    },
  ])("route `$route`", async ({ route, method, formData }) => {
    let body;
    if (formData) {
      body = new FormData();
      for (const [name, value] of Object.entries(formData)) {
        body.append(name, value);
      }
    }

    const baseUrl = "http://localhost:8787";
    const req = new Request(`${baseUrl}${route}`, {
      method,
      body,
      headers: {
        origin: baseUrl,
      },
    });

    let res = await worker.fetch(req, env, createExecutionContext());
    if (res.status === 302 && res.headers.get("location")) {
      res = await worker.fetch(
        new Request(`${baseUrl}${res.headers.get("location")}`),
        env,
        createExecutionContext()
      );
    }

    const resRext = await res.text();
    expect(resRext).toMatchSnapshot();
  });
});
