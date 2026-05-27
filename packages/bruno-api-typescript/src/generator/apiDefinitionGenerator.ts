/**
 * API Definition Generator
 * Generates typed API metadata definitions from Bruno files
 */

import { ParsedBrunoFile } from '../parser/bruParser';
import { ApiFunction } from './apiClientGenerator';
import { toCamelCase, toObjectPropertyKey } from './typeGenerator';

export interface ApiDefinitionMeta {
  displayName: string;
  sourceFile?: string;
  method: string;
  path: string;
  pathParams: string;
  queryParams: string;
  body: string;
  response: string;
  pathParamsExample: Record<string, string>;
  queryParamsExample: Record<string, unknown>;
  bodyExample: unknown;
  hasBody: boolean;
  bodyType: string | null;
  canExecute: boolean;
}

export interface ApiDefinitionInput {
  apiFunc: ApiFunction;
  parsed: ParsedBrunoFile;
  filePath?: string;
  sourceFile?: string;
}

function toPascalCase(value: string): string {
  const camel = toCamelCase(value);
  return `${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
}

const SLACK_WEBHOOK_URL_PLACEHOLDER = 'SLACK_WEBHOOK_URL';

function getPathOnly(url: string): string {
  const questionMarkIndex = url.indexOf('?');
  return questionMarkIndex >= 0 ? url.slice(0, questionMarkIndex) : url;
}

function isSensitiveWebhookUrl(url: string): boolean {
  return /^https:\/\/hooks\.slack\.com\/services\//i.test(url);
}

function sanitizeApiDefinitionPath(url: string): string {
  return isSensitiveWebhookUrl(url) ? SLACK_WEBHOOK_URL_PLACEHOLDER : url;
}

function isUploadLikeEndpoint(url: string, sourceFile?: string): boolean {
  const path = getPathOnly(url).replace(/\{\{URL\}\}/g, '');
  return /(?:^|\/)file(?:\/|$)/i.test(path) || /upload|업로드/i.test(sourceFile ?? '');
}

function shouldAllowExecution(method: string, url: string, parsed: ParsedBrunoFile, sourceFile?: string): boolean {
  if (isSensitiveWebhookUrl(url) || parsed.body?.type === 'multipart-form') {
    return false;
  }

  const hasParsedBody = Boolean(parsed.body?.content?.trim());
  if (method !== 'GET' && method !== 'HEAD' && !hasParsedBody && isUploadLikeEndpoint(url, sourceFile)) {
    return false;
  }

  return true;
}

/**
 * Extract URL parameters from a path
 */
function extractPathParams(url: string): string[] {
  const params: string[] = [];
  
  let processedUrl = getPathOnly(url).replace(/\{\{URL\}\}/g, '');
  
  const brunoVarPattern = /\{\{([^}]+)\}\}/g;
  for (const match of processedUrl.matchAll(brunoVarPattern)) {
    const varName = match[1];
    if (varName === 'URL') continue;
    const camelVarName = toCamelCase(varName);
    if (!params.includes(camelVarName)) {
      params.push(camelVarName);
    }
  }

  // Bruno 변수를 제거한 뒤 일반 URL 파라미터(:id, {id})를 추출해야 중복이 생기지 않음
  processedUrl = processedUrl.replace(/\{\{[^}]+\}\}/g, '');
  
  const urlParamMatches = processedUrl.matchAll(/:(\w+)|\{(\w+)\}/g);
  for (const match of urlParamMatches) {
    const paramName = match[1] || match[2];
    if (!params.includes(paramName)) {
      params.push(paramName);
    }
  }
  
  return params;
}

function extractPathParamTokens(url: string): string[] {
  const params: string[] = [];
  let processedUrl = getPathOnly(url).replace(/\{\{URL\}\}/g, '');

  const brunoVarPattern = /\{\{([^}]+)\}\}/g;
  for (const match of processedUrl.matchAll(brunoVarPattern)) {
    const varName = match[1];
    if (varName === 'URL') continue;
    if (!params.includes(varName)) {
      params.push(varName);
    }
  }

  processedUrl = processedUrl.replace(/\{\{[^}]+\}\}/g, '');

  const urlParamMatches = processedUrl.matchAll(/:(\w+)|\{(\w+)\}/g);
  for (const match of urlParamMatches) {
    const paramName = match[1] || match[2];
    if (!params.includes(paramName)) {
      params.push(paramName);
    }
  }

  return params;
}

function extractInlineQueryParams(url: string): Record<string, string> {
  const questionMarkIndex = url.indexOf('?');
  if (questionMarkIndex < 0) {
    return {};
  }

  const queryString = url.slice(questionMarkIndex + 1);
  return Object.fromEntries(Array.from(new URLSearchParams(queryString)).map(([key, value]) => [key, value.trim()]));
}

function parseBodyExample(parsed: ParsedBrunoFile): unknown {
  if (!parsed.body?.content?.trim() || parsed.body.type !== 'json') {
    return undefined;
  }

  try {
    return JSON.parse(parsed.body.content);
  } catch {
    return undefined;
  }
}

function toTsLiteral(value: unknown, indent = 0): string {
  if (value === undefined) {
    return 'undefined';
  }

  const literal = JSON.stringify(value, null, 2) ?? 'undefined';
  if (indent === 0) {
    return literal;
  }

  const padding = ' '.repeat(indent);
  return literal
    .split('\n')
    .map((line, index) => (index === 0 ? line : `${padding}${line}`))
    .join('\n');
}

/**
 * Generate API definition metadata for a single API function
 */
export function generateApiDefinitionMeta(
  apiFunc: ApiFunction,
  parsed: ParsedBrunoFile,
  sourceFile?: string
): ApiDefinitionMeta {
  const { method, url, responseType } = apiFunc;
  const sanitizedPath = sanitizeApiDefinitionPath(url);
  const pathParams = extractPathParams(url);
  const pathParamTokens = extractPathParamTokens(url);
  const bodyExample = parseBodyExample(parsed);
  const bodyTypeName = parsed.body?.type ?? null;
  
  const pathParamsType = pathParams.length > 0 
    ? `{ ${pathParams.map(p => `${p}: string | number`).join('; ')} }`
    : 'Record<string, never>';
    
  const queryParamsType = method === 'GET' 
    ? 'Record<string, unknown>'
    : 'Record<string, never>';
    
  const requestType = responseType.replace('Response', 'Request');
  const hasBody = method !== 'GET' && method !== 'HEAD' && Boolean(parsed.body?.content?.trim());
  const bodyType = hasBody ? requestType : 'Record<string, never>';
  
  return {
    displayName: parsed.meta.name || apiFunc.name,
    sourceFile,
    method,
    path: sanitizedPath,
    pathParams: pathParamsType,
    queryParams: queryParamsType,
    body: bodyType,
    response: responseType,
    pathParamsExample: Object.fromEntries(pathParamTokens.map((paramName) => [paramName, ''])),
    queryParamsExample: {
      ...extractInlineQueryParams(url),
      ...(parsed.queryParams ?? {}),
    },
    bodyExample,
    hasBody,
    bodyType: bodyTypeName,
    canExecute: shouldAllowExecution(method, url, parsed, sourceFile),
  };
}

/**
 * Generate apiDefinitions.ts file content
 */
export function generateApiDefinitionsFile(
  apiFunctions: ApiDefinitionInput[],
  domain: string
): string {
  const lines: string[] = [];
  
  const typeNames = new Set<string>();
  
  for (const { apiFunc, parsed, sourceFile } of apiFunctions) {
    const meta = generateApiDefinitionMeta(apiFunc, parsed, sourceFile);
    
    if (meta.response !== 'void') {
      typeNames.add(meta.response);
    }
    if (meta.body !== 'Record<string, never>') {
      typeNames.add(meta.body);
    }
  }
  
  const sortedTypes = Array.from(typeNames).sort();
  if (sortedTypes.length > 0) {
    lines.push(`import type { ${sortedTypes.join(', ')} } from './api';`);
    lines.push('');
  }
  
  const definitionsConstName = `${toCamelCase(domain)}ApiDefinitions`;
  const definitionsTypeName = `${toPascalCase(domain)}ApiDefinitions`;
  lines.push(`export const ${definitionsConstName} = {`);
  
  for (const { apiFunc, parsed, sourceFile } of apiFunctions) {
    const meta = generateApiDefinitionMeta(apiFunc, parsed, sourceFile);
    const bodyValue = `undefined as unknown as ${meta.body}`;
    const responseValue = `undefined as unknown as ${meta.response}`;
    
    lines.push(`  ${toObjectPropertyKey(apiFunc.name)}: {`);
    lines.push(`    displayName: ${JSON.stringify(meta.displayName)},`);
    if (sourceFile) {
      lines.push(`    sourceFile: ${JSON.stringify(sourceFile)},`);
    }
    lines.push(`    method: ${JSON.stringify(meta.method)} as const,`);
    lines.push(`    path: ${JSON.stringify(meta.path)} as const,`);
    lines.push(`    pathParams: {} as ${meta.pathParams},`);
    lines.push(`    queryParams: {} as ${meta.queryParams},`);
    lines.push(`    body: ${bodyValue},`);
    lines.push(`    response: ${responseValue},`);
    lines.push(`    pathParamsExample: ${toTsLiteral(meta.pathParamsExample, 4)},`);
    lines.push(`    queryParamsExample: ${toTsLiteral(meta.queryParamsExample, 4)},`);
    lines.push(`    bodyExample: ${toTsLiteral(meta.bodyExample, 4)},`);
    lines.push(`    hasBody: ${meta.hasBody},`);
    lines.push(`    bodyType: ${toTsLiteral(meta.bodyType)},`);
    lines.push(`    canExecute: ${meta.canExecute},`);
    lines.push(`  },`);
  }
  
  lines.push('} as const;');
  lines.push('');
  
  lines.push(`export type ${definitionsTypeName} = typeof ${definitionsConstName};`);
  
  return lines.join('\n');
}

export function generateApiDefinitionRegistryFile(
  apiFunctions: Array<ApiDefinitionInput & { domain: string }>
): string {
  const lines: string[] = [
    'export interface BrunoApiDefinitionRegistryItem {',
    '  domain: string;',
    '  name: string;',
    '  displayName: string;',
    '  sourceFile?: string;',
    '  definition: {',
    "    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';",
    '    path: string;',
    '    pathParamsExample: Record<string, string>;',
    '    queryParamsExample: Record<string, unknown>;',
    '    bodyExample?: unknown;',
    '    hasBody: boolean;',
    '    bodyType: string | null;',
    '    canExecute?: boolean;',
    '  };',
    '}',
    '',
    'export const brunoApiDefinitionRegistry = [',
  ];

  for (const { apiFunc, parsed, domain, sourceFile } of apiFunctions) {
    const meta = generateApiDefinitionMeta(apiFunc, parsed, sourceFile);
    lines.push('  {');
    lines.push(`    domain: ${JSON.stringify(domain)},`);
    lines.push(`    name: ${JSON.stringify(apiFunc.name)},`);
    lines.push(`    displayName: ${JSON.stringify(meta.displayName)},`);
    if (meta.sourceFile) {
      lines.push(`    sourceFile: ${JSON.stringify(meta.sourceFile)},`);
    }
    lines.push('    definition: {');
    lines.push(`      method: ${JSON.stringify(meta.method)},`);
    lines.push(`      path: ${JSON.stringify(meta.path)},`);
    lines.push(`      pathParamsExample: ${toTsLiteral(meta.pathParamsExample, 6)},`);
    lines.push(`      queryParamsExample: ${toTsLiteral(meta.queryParamsExample, 6)},`);
    if (meta.bodyExample !== undefined) {
      lines.push(`      bodyExample: ${toTsLiteral(meta.bodyExample, 6)},`);
    }
    lines.push(`      hasBody: ${meta.hasBody},`);
    lines.push(`      bodyType: ${toTsLiteral(meta.bodyType)},`);
    lines.push(`      canExecute: ${meta.canExecute},`);
    lines.push('    },');
    lines.push('  },');
  }

  lines.push('] as const satisfies readonly BrunoApiDefinitionRegistryItem[];');
  lines.push('');
  lines.push('export type BrunoApiDefinitionRegistry = typeof brunoApiDefinitionRegistry;');

  return lines.join('\n');
}
