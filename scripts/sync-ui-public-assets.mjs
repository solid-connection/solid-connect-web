import { cp, lstat, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../packages/ui/public/images/language/", import.meta.url));
const targetArg = process.argv[2] ?? "public/images/language";
const target = path.resolve(process.cwd(), targetArg);

try {
  const stat = await lstat(target);
  if (!stat.isDirectory() && !stat.isSymbolicLink()) {
    throw new Error(`${target} exists but is not a directory`);
  }
  await rm(target, { force: true, recursive: true });
} catch (error) {
  if (error?.code !== "ENOENT") {
    throw error;
  }
}

await mkdir(path.dirname(target), { recursive: true });
await cp(source, target, { recursive: true });

console.log(`Synced UI public assets: ${path.relative(process.cwd(), target)}`);
