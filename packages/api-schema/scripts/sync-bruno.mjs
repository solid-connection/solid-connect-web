import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = resolve(process.cwd());
const defaultLocalCollectionDir = resolve(rootDir, "../../../api-docs/Solid Connection");
const cacheRoot = resolve(rootDir, ".cache");
const checkoutDir = resolve(cacheRoot, "bruno-source");
const sourceMode = process.env.BRUNO_SOURCE_MODE ?? "auto";
const remoteRepoUrl = process.env.BRUNO_REPO_URL;
const remoteRepoRef = process.env.BRUNO_REPO_REF ?? "main";
const remoteCollectionPath = process.env.BRUNO_COLLECTION_PATH ?? "Solid Connection";
const explicitCollectionDir = process.env.BRUNO_COLLECTION_DIR;

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

function ensureRemoteCollectionDir() {
  if (!remoteRepoUrl) {
    throw new Error("BRUNO_REPO_URL is required when BRUNO source is remote.");
  }

  mkdirSync(cacheRoot, { recursive: true });
  rmSync(checkoutDir, { recursive: true, force: true });
  run("git", ["clone", "--depth", "1", "--branch", remoteRepoRef, remoteRepoUrl, checkoutDir]);

  const collectionDir = resolve(checkoutDir, remoteCollectionPath);
  if (!existsSync(collectionDir)) {
    throw new Error(`Bruno collection path does not exist: ${collectionDir}`);
  }

  return collectionDir;
}

function resolveCollectionDir() {
  if (explicitCollectionDir) {
    const fullPath = resolve(rootDir, explicitCollectionDir);
    if (!existsSync(fullPath)) {
      throw new Error(`BRUNO_COLLECTION_DIR does not exist: ${fullPath}`);
    }
    return fullPath;
  }

  if (sourceMode === "local") {
    if (!existsSync(defaultLocalCollectionDir)) {
      throw new Error(`Local Bruno collection directory does not exist: ${defaultLocalCollectionDir}`);
    }
    return defaultLocalCollectionDir;
  }

  if (sourceMode === "remote") {
    return ensureRemoteCollectionDir();
  }

  if (existsSync(defaultLocalCollectionDir)) {
    return defaultLocalCollectionDir;
  }

  return ensureRemoteCollectionDir();
}

const collectionDir = resolveCollectionDir();

run("pnpm", ["-C", "../bruno-api-typescript", "run", "build"]);
run("node", [
  "../bruno-api-typescript/dist/cli/index.js",
  "generate-hooks",
  "-i",
  collectionDir,
  "-o",
  "./src/apis",
  "--axios-path",
  "../axiosInstance",
]);
