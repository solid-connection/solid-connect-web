/**
 * API Definition Generator
 * Generates typed API metadata definitions from Bruno files
 */

import type { ParsedBrunoFile } from "../parser/bruParser";
import type { ApiFunction } from "./apiClientGenerator";
import { toCamelCase } from "./typeGenerator";

export interface ApiDefinitionMeta {
  method: string;
  path: string;
  pathParams: string;
  queryParams: string;
  body: string;
  response: string;
}

function toPascalCase(value: string): string {
  const camel = toCamelCase(value);
  return `${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
}

function normalizeApiPath(url: string): string {
  return url.replace(/\{\{URL\}\}/g, "").split("?")[0];
}

function createTypePlaceholder(typeName: string): string {
  return `undefined as unknown as ${typeName}`;
}

/**
 * Extract URL parameters from a path
 */
function extractPathParams(url: string): string[] {
  const params: string[] = [];

  const processedUrl = normalizeApiPath(url);

  const brunoVarPattern = /\{\{([^}]+)\}\}/g;
  for (const match of processedUrl.matchAll(brunoVarPattern)) {
    const varName = match[1];
    if (varName === "URL") {
      continue;
    }

    const camelVarName = varName.replace(/-([a-z])/g, (_fullMatch, character: string) => character.toUpperCase());
    if (!params.includes(camelVarName)) {
      params.push(camelVarName);
    }
  }

  const urlParamMatches = processedUrl.matchAll(/:(\w+)|\{(\w+)\}/g);
  for (const match of urlParamMatches) {
    const paramName = match[1] || match[2];
    if (!params.includes(paramName)) {
      params.push(paramName);
    }
  }

  return params;
}

/**
 * Generate API definition metadata for a single API function
 */
export function generateApiDefinitionMeta(apiFunc: ApiFunction, parsed: ParsedBrunoFile): ApiDefinitionMeta {
  const { method, url, responseType } = apiFunc;
  const normalizedPath = normalizeApiPath(url);
  const pathParams = extractPathParams(normalizedPath);
  const hasInlineQuery = url.includes("?");

  const pathParamsType =
    pathParams.length > 0
      ? `{ ${pathParams.map((p) => `${p}: string | number`).join("; ")} }`
      : "Record<string, never>";

  const queryParamsType = method === "GET" || hasInlineQuery ? "Record<string, unknown>" : "Record<string, never>";

  const requestType = responseType.replace("Response", "Request");
  const hasBody = ["POST", "PUT", "PATCH"].includes(method) && Boolean(parsed.body?.content?.trim());
  const bodyType = hasBody ? requestType : "Record<string, never>";

  return {
    method,
    path: normalizedPath,
    pathParams: pathParamsType,
    queryParams: queryParamsType,
    body: bodyType,
    response: responseType,
  };
}

/**
 * Generate apiDefinitions.ts file content
 */
export function generateApiDefinitionsFile(
  apiFunctions: Array<{ apiFunc: ApiFunction; parsed: ParsedBrunoFile }>,
  domain: string,
): string {
  const lines: string[] = [];

  const typeNames = new Set<string>();

  for (const { apiFunc, parsed } of apiFunctions) {
    const meta = generateApiDefinitionMeta(apiFunc, parsed);

    if (meta.response !== "void") {
      typeNames.add(meta.response);
    }
    if (meta.body !== "Record<string, never>") {
      typeNames.add(meta.body);
    }
  }

  const sortedTypes = Array.from(typeNames).sort();
  if (sortedTypes.length > 0) {
    lines.push(`import type { ${sortedTypes.join(", ")} } from './api';`);
    lines.push("");
  }

  const definitionsConstName = `${toCamelCase(domain)}ApiDefinitions`;
  const definitionsTypeName = `${toPascalCase(domain)}ApiDefinitions`;
  lines.push(`export const ${definitionsConstName} = {`);

  for (const { apiFunc, parsed } of apiFunctions) {
    const meta = generateApiDefinitionMeta(apiFunc, parsed);

    lines.push(`  ${apiFunc.name}: {`);
    lines.push(`    method: '${meta.method}' as const,`);
    lines.push(`    path: '${meta.path}' as const,`);
    lines.push(`    pathParams: ${createTypePlaceholder(meta.pathParams)},`);
    lines.push(`    queryParams: ${createTypePlaceholder(meta.queryParams)},`);
    lines.push(`    body: ${createTypePlaceholder(meta.body)},`);
    lines.push(`    response: ${createTypePlaceholder(meta.response)},`);
    lines.push(`  },`);
  }

  lines.push("} as const;");
  lines.push("");

  lines.push(`export type ${definitionsTypeName} = typeof ${definitionsConstName};`);

  return lines.join("\n");
}
