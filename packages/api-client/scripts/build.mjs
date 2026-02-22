import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = resolve(process.cwd());
const generatedIndexPath = resolve(rootDir, "src/generated/index.ts");

function run(command, args, cwd = rootDir) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function isTruthy(value) {
  if (!value) {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

if (isTruthy(process.env.BRUNO_SYNC_ON_BUILD)) {
  run("pnpm", ["run", "sync:bruno"]);
  process.exit(0);
}

if (!existsSync(generatedIndexPath)) {
  console.error(`[api-client] Missing generated client: ${generatedIndexPath}`);
  console.error("[api-client] Run `pnpm --filter @solid-connect/api-client run sync:bruno` and commit the changes.");
  process.exit(1);
}

console.log("[api-client] Using committed generated client artifacts for build.");
console.log("[api-client] Set BRUNO_SYNC_ON_BUILD=true to regenerate from Bruno during build.");
