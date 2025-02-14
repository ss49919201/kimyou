import { Miniflare } from "miniflare";

export async function startWorker(): Promise<Miniflare> {
  const worker = new Miniflare({
    modules: [
      {
        type: "ESModule",
        path: "./dist/index.js",
      },
    ],
    d1Databases: ["D1"],
  });
  await worker.ready;
  return worker;
}
