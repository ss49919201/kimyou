import type { Unstable_DevWorker } from "wrangler";
import { unstable_dev } from "wrangler";

export async function runWorker(): Promise<Unstable_DevWorker> {
  return await unstable_dev("./src/index.tsx", {
    experimental: { disableExperimentalWarning: true },
  });
}

export async function stopWorker(worker: Unstable_DevWorker): Promise<void> {
  await worker.stop();
}
