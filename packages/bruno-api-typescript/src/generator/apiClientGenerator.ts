/**
 * Axios API 클라이언트 생성기
 * Bruno 파일로부터 axios API 호출 함수 생성
 */

import type { ParsedBrunoFile } from "../parser/bruParser";
import { functionNameToTypeName, toCamelCase } from "./typeGenerator";

export interface ApiFunction {
  name: string;
  method: string;
  url: string;
  responseType: string;
  requestType?: string;
  hasParams: boolean;
  hasBody: boolean;
}

const METHOD_PREFIX_PATTERN = /^(get|post|put|patch|delete|head|options)/i;

function normalizeUrlPath(url: string): string {
  return url.replace(/\{\{URL\}\}/g, "").split("?")[0];
}

function extractBracketKey(value: string): string | null {
  const match = value.match(/\[([^\]]+)\]/);
  if (!match) {
    return null;
  }

  return match[1].trim();
}

function sanitizeAscii(value: string): string {
  const asciiOnly = Array.from(value.normalize("NFKD"))
    .map((char) => (char.charCodeAt(0) <= 0x7e ? char : " "))
    .join("");

  return asciiOnly
    .replace(/[^a-zA-Z0-9\s_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function ensureIdentifier(value: string): string {
  const normalized = value.replace(/[^a-zA-Z0-9_]/g, "");
  if (!normalized) {
    return "apiEndpoint";
  }

  if (/^[0-9]/.test(normalized)) {
    return `api${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;
  }

  return normalized;
}

function toSafeBaseName(value: string): string | null {
  const sanitized = sanitizeAscii(value);
  if (!sanitized) {
    return null;
  }

  const normalized = sanitized
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!normalized) {
    return null;
  }

  return ensureIdentifier(toCamelCase(normalized));
}

function pathToBaseName(url: string): string {
  const path = normalizeUrlPath(url);
  const segments = path
    .split("/")
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.replace(/^[:{]/, "").replace(/}$/, ""))
    .filter((segment) => segment.length > 0);

  if (segments.length === 0) {
    return "endpoint";
  }

  const candidate = toSafeBaseName(segments.join("-"));
  return candidate ?? "endpoint";
}

function buildFunctionName(method: string, baseName: string): string {
  const methodPrefix = method.toLowerCase();
  const methodMatched = baseName.match(METHOD_PREFIX_PATTERN);

  if (methodMatched && methodMatched[1].toLowerCase() === methodPrefix) {
    return ensureIdentifier(baseName);
  }

  return ensureIdentifier(`${methodPrefix}${baseName.charAt(0).toUpperCase()}${baseName.slice(1)}`);
}

function resolveBaseFunctionName(parsed: ParsedBrunoFile, filePath: string): string {
  const fileName = filePath.split("/").pop()?.replace(".bru", "") ?? "";
  const candidates = [
    extractBracketKey(parsed.meta.name),
    extractBracketKey(fileName),
    parsed.meta.name,
    fileName,
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    const safeName = toSafeBaseName(candidate);
    if (safeName) {
      return safeName;
    }
  }

  return pathToBaseName(parsed.http.url);
}

/**
 * Bruno 파일로부터 API 함수 정보 추출
 */
export function extractApiFunction(parsed: ParsedBrunoFile, filePath: string): ApiFunction | null {
  const { http } = parsed;

  if (!http.method || !http.url) {
    return null;
  }

  const baseFunctionName = resolveBaseFunctionName(parsed, filePath);
  const functionName = buildFunctionName(http.method, baseFunctionName);
  const responseType = functionNameToTypeName(functionName);

  // URL에 파라미터가 있는지 확인
  const hasParams = http.url.includes(":") || http.url.includes("{");

  // POST, PUT, PATCH는 body를 가질 수 있음
  const hasBody = ["POST", "PUT", "PATCH"].includes(http.method.toUpperCase());

  return {
    name: functionName,
    method: http.method.toUpperCase(),
    url: http.url,
    responseType,
    hasParams,
    hasBody,
  };
}

/**
 * API 함수 코드 생성
 */
export function generateApiFunction(apiFunc: ApiFunction, _domain: string): string {
  const { name, method, url, responseType, hasBody } = apiFunc;

  const lines: string[] = [];

  // 파라미터 인터페이스 생성
  const paramsList: string[] = [];
  const urlParams: string[] = [];

  // URL 파라미터 추출
  const urlParamMatches = url.matchAll(/:(\w+)|\{(\w+)\}/g);
  for (const match of urlParamMatches) {
    const paramName = match[1] || match[2];
    urlParams.push(paramName);
    paramsList.push(`${paramName}: string | number`);
  }

  // Query 파라미터
  if (method === "GET") {
    paramsList.push("params?: Record<string, unknown>");
  }

  // Body 파라미터
  if (hasBody) {
    paramsList.push(`data?: ${responseType.replace("Response", "Request")}`);
  }

  // 함수 시그니처
  const paramsStr = paramsList.length > 0 ? `{ ${paramsList.join(", ")} }` : "";
  const paramsType = paramsList.length > 0 ? `params: ${paramsStr}` : "";

  // URL 생성 로직
  let urlExpression = `\`${url}\``;
  for (const param of urlParams) {
    urlExpression = urlExpression.replace(`:${param}`, `\${params.${param}}`);
    urlExpression = urlExpression.replace(`{${param}}`, `\${params.${param}}`);
  }

  // 함수 생성
  lines.push(`const ${name} = async (${paramsType}): Promise<${responseType}> => {`);

  const configParts: string[] = [];
  if (method === "GET" && paramsList.some((p) => p.includes("params?"))) {
    configParts.push("params: params?.params");
  }

  const configStr = configParts.length > 0 ? `, { ${configParts.join(", ")} }` : "";
  const bodyStr = hasBody ? ", params?.data" : "";

  lines.push(`  const res = await axiosInstance.${method.toLowerCase()}<${responseType}>(`);
  lines.push(`    ${urlExpression}${bodyStr}${configStr}`);
  lines.push(`  );`);
  lines.push(`  return res.data;`);
  lines.push(`};`);

  return lines.join("\n");
}
