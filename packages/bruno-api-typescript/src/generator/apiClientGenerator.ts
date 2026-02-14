/**
 * Axios API 클라이언트 생성기
 * Bruno 파일로부터 axios API 호출 함수 생성
 */

import { ParsedBrunoFile } from '../parser/bruParser';
import { extractJsonFromDocs } from '../parser/bruParser';
import { generateTypeScriptInterface, urlToFunctionName, functionNameToTypeName, toCamelCase } from './typeGenerator';

export interface ApiFunction {
  name: string;
  method: string;
  url: string;
  responseType: string;
  requestType?: string;
  hasParams: boolean;
  hasBody: boolean;
}

/**
 * Bruno 파일로부터 API 함수 정보 추출
 */
export function extractApiFunction(parsed: ParsedBrunoFile, filePath: string): ApiFunction | null {
  const { http, meta } = parsed;

  if (!http.method || !http.url) {
    return null;
  }

  // .bru 파일명에서 함수명 생성
  let fileName = filePath.split('/').pop()?.replace('.bru', '') || '';
  
  // 한글명 [영문키] 패턴 추출: 멘토 목록 조회 [mentor-list] → mentor-list
  const bracketPattern = /\[([^\]]+)\]/;
  const bracketMatch = fileName.match(bracketPattern);
  if (bracketMatch) {
    fileName = bracketMatch[1].trim(); // 대괄호 안의 영문키만 사용
  }
  
  const baseFunctionName = toCamelCase(fileName);
  // HTTP 메서드 prefix 추가: signOut → postSignOut
  const methodPrefix = http.method.toLowerCase();
  const functionName = `${methodPrefix}${baseFunctionName.charAt(0).toUpperCase()}${baseFunctionName.slice(1)}`;
  const responseType = functionNameToTypeName(baseFunctionName);

  // URL에 파라미터가 있는지 확인
  const hasParams = http.url.includes(':') || http.url.includes('{');

  // POST, PUT, PATCH는 body를 가질 수 있음
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(http.method.toUpperCase());

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
export function generateApiFunction(apiFunc: ApiFunction, domain: string): string {
  const { name, method, url, responseType, hasParams, hasBody } = apiFunc;

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
  if (method === 'GET') {
    paramsList.push('params?: Record<string, unknown>');
  }

  // Body 파라미터
  if (hasBody) {
    paramsList.push(`data?: ${responseType.replace('Response', 'Request')}`);
  }

  // 함수 시그니처
  const paramsStr = paramsList.length > 0 ? `{ ${paramsList.join(', ')} }` : '';
  const paramsType = paramsList.length > 0 ? `params: ${paramsStr}` : '';

  // URL 생성 로직
  let urlExpression = `\`${url}\``;
  for (const param of urlParams) {
    urlExpression = urlExpression.replace(`:${param}`, `\${params.${param}}`);
    urlExpression = urlExpression.replace(`{${param}}`, `\${params.${param}}`);
  }

  // 함수 생성
  lines.push(`const ${name} = async (${paramsType}): Promise<${responseType}> => {`);

  const configParts: string[] = [];
  if (method === 'GET' && paramsList.some(p => p.includes('params?'))) {
    configParts.push('params: params?.params');
  }

  const configStr = configParts.length > 0 ? `, { ${configParts.join(', ')} }` : '';
  const bodyStr = hasBody ? ', params?.data' : '';

  lines.push(`  const res = await axiosInstance.${method.toLowerCase()}<${responseType}>(`);
  lines.push(`    ${urlExpression}${bodyStr}${configStr}`);
  lines.push(`  );`);
  lines.push(`  return res.data;`);
  lines.push(`};`);

  return lines.join('\n');
}
