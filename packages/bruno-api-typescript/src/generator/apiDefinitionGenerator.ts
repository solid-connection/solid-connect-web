/**
 * API Definition Generator
 * Generates typed API metadata definitions from Bruno files
 */

import { ParsedBrunoFile } from '../parser/bruParser';
import { ApiFunction } from './apiClientGenerator';
import { toCamelCase } from './typeGenerator';

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

/**
 * Extract URL parameters from a path
 */
function extractPathParams(url: string): string[] {
  const params: string[] = [];
  
  let processedUrl = url.replace(/\{\{URL\}\}/g, '');
  
  const brunoVarPattern = /\{\{([^}]+)\}\}/g;
  let match;
  while ((match = brunoVarPattern.exec(processedUrl)) !== null) {
    const varName = match[1];
    if (varName === 'URL') continue;
    const camelVarName = varName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
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
export function generateApiDefinitionMeta(
  apiFunc: ApiFunction,
  parsed: ParsedBrunoFile
): ApiDefinitionMeta {
  const { method, url, responseType } = apiFunc;
  const pathParams = extractPathParams(url);
  
  const pathParamsType = pathParams.length > 0 
    ? `{ ${pathParams.map(p => `${p}: string | number`).join('; ')} }`
    : 'Record<string, never>';
    
  const queryParamsType = method === 'GET' 
    ? 'Record<string, unknown>'
    : 'Record<string, never>';
    
  const requestType = responseType.replace('Response', 'Request');
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method) && Boolean(parsed.body?.content?.trim());
  const bodyType = hasBody ? requestType : 'Record<string, never>';
  
  return {
    method,
    path: url,
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
  domain: string
): string {
  const lines: string[] = [];
  
  const typeNames = new Set<string>();
  
  for (const { apiFunc, parsed } of apiFunctions) {
    const meta = generateApiDefinitionMeta(apiFunc, parsed);
    
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
  
  for (const { apiFunc, parsed } of apiFunctions) {
    const meta = generateApiDefinitionMeta(apiFunc, parsed);
    
    lines.push(`  ${apiFunc.name}: {`);
    lines.push(`    method: '${meta.method}' as const,`);
    lines.push(`    path: '${meta.path}' as const,`);
    lines.push(`    pathParams: {} as ${meta.pathParams},`);
    lines.push(`    queryParams: {} as ${meta.queryParams},`);
    lines.push(`    body: {} as ${meta.body},`);
    lines.push(`    response: {} as ${meta.response},`);
    lines.push(`  },`);
  }
  
  lines.push('} as const;');
  lines.push('');
  
  lines.push(`export type ${definitionsTypeName} = typeof ${definitionsConstName};`);
  
  return lines.join('\n');
}
