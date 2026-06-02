#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webSrcDir = path.join(repoRoot, "apps/web/src");
const checkedExtensions = new Set([".ts", ".tsx"]);

const allowedMainWebUniversityRoutes = ["/university/score", "/university/application"];

const jsxHrefPattern =
  /<([A-Za-z][\w.]*)\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\}|\{\s*`([^`]*)`\s*\})/g;
const navigationCallPattern =
  /\b(?:router\.(push|replace)|redirect|window\.location\.(assign|replace))\(\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/g;
const locationHrefAssignmentPattern = /\bwindow\.location\.href\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/g;

const listSourceFiles = (directory) => {
  const entries = readdirSync(directory);

  return entries.flatMap((entry) => {
    const absolutePath = path.join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      return listSourceFiles(absolutePath);
    }

    return checkedExtensions.has(path.extname(entry)) ? [absolutePath] : [];
  });
};

const normalizeRoute = (rawRoute) => rawRoute.trim();

const isAllowedMainWebUniversityRoute = (route) => {
  const pathname = route.split(/[?#]/)[0];

  return allowedMainWebUniversityRoutes.some((allowedRoute) => {
    return pathname === allowedRoute || pathname.startsWith(`${allowedRoute}/`);
  });
};

const isUniversityCatalogRoute = (rawRoute) => {
  const route = normalizeRoute(rawRoute);

  if (
    route !== "/university" &&
    !route.startsWith("/university/") &&
    !route.startsWith("/university?") &&
    !route.startsWith("/university#")
  ) {
    return false;
  }

  return !isAllowedMainWebUniversityRoute(route);
};

const getLineAndColumn = (source, index) => {
  const linesBeforeMatch = source.slice(0, index).split("\n");

  return {
    line: linesBeforeMatch.length,
    column: linesBeforeMatch.at(-1).length + 1,
  };
};

const formatRelativePath = (absolutePath) => path.relative(repoRoot, absolutePath);

const createViolation = ({ filePath, source, index, message }) => {
  const { line, column } = getLineAndColumn(source, index);

  return `${formatRelativePath(filePath)}:${line}:${column} ${message}`;
};

const pickMatchedRoute = (match, startIndex) => {
  for (let index = startIndex; index < match.length; index += 1) {
    if (typeof match[index] === "string") {
      return match[index];
    }
  }

  return null;
};

const collectViolations = (filePath) => {
  const source = readFileSync(filePath, "utf8");
  const violations = [];

  for (const match of source.matchAll(jsxHrefPattern)) {
    const [, tagName] = match;
    const route = pickMatchedRoute(match, 2);

    if (tagName === "a" || route === null || !isUniversityCatalogRoute(route)) {
      continue;
    }

    violations.push(
      createViolation({
        filePath,
        source,
        index: match.index,
        message: `Use <a href="${route}"> for university catalog navigation instead of <${tagName}>.`,
      }),
    );
  }

  for (const match of source.matchAll(navigationCallPattern)) {
    const route = pickMatchedRoute(match, 3);

    if (route === null || !isUniversityCatalogRoute(route)) {
      continue;
    }

    violations.push(
      createViolation({
        filePath,
        source,
        index: match.index,
        message: `Use <a href="${route}"> for university catalog navigation instead of client navigation.`,
      }),
    );
  }

  for (const match of source.matchAll(locationHrefAssignmentPattern)) {
    const route = pickMatchedRoute(match, 1);

    if (route === null || !isUniversityCatalogRoute(route)) {
      continue;
    }

    violations.push(
      createViolation({
        filePath,
        source,
        index: match.index,
        message: `Use <a href="${route}"> for university catalog navigation instead of location.href.`,
      }),
    );
  }

  return violations;
};

const violations = listSourceFiles(webSrcDir).flatMap(collectViolations);

if (violations.length > 0) {
  console.error("University catalog navigation must use plain <a> tags in apps/web.");
  console.error("Allowed main-web exceptions: /university/score, /university/application");
  console.error("");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("University catalog navigation rule passed.");
