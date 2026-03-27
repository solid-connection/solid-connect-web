import { execFileSync } from "node:child_process";
import process from "node:process";

const ONE_SECOND = 1_000;
const defaultIntervalSeconds = 15 * 60;

const parseIntervalSeconds = () => {
  const rawValue = process.env.AI_INSPECTOR_POLL_INTERVAL_SECONDS;
  if (!rawValue) {
    return defaultIntervalSeconds;
  }

  const value = Number(rawValue);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("AI_INSPECTOR_POLL_INTERVAL_SECONDS must be a positive number.");
  }

  return value;
};

const runOnce = async () => {
  execFileSync("node", [".github/scripts/ai-inspector-worker.mjs"], {
    stdio: "inherit",
    env: process.env,
  });
};

const sleep = async (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const loop = async () => {
  const intervalSeconds = parseIntervalSeconds();
  while (true) {
    const startedAt = Date.now();
    try {
      await runOnce();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[ai-inspector-worker-loop] run failed: ${message}`);
    }

    const elapsed = Date.now() - startedAt;
    const waitMs = Math.max(ONE_SECOND, intervalSeconds * ONE_SECOND - elapsed);
    await sleep(waitMs);
  }
};

loop().catch((error) => {
  console.error(error);
  process.exit(1);
});
