/**
 * MSW (Mock Service Worker) 핸들러 생성
 * Bruno 파일에서 MSW 핸들러를 자동 생성
 */

import { ParsedBrunoFile, extractJsonFromDocs } from '../parser/bruParser';

export interface MSWHandler {
  domain: string;
  fileName: string;
  content: string;
}

/**
 * MSW 핸들러 생성
 * 모든 API에 대해 MSW 핸들러 생성 (프론트엔드에서 플래그로 제어)
 * docs가 없어도 기본 응답으로 생성 (테스트 용)
 */
export function generateMSWHandler(
  parsed: ParsedBrunoFile,
  filePath: string,
  domain: string
): MSWHandler | null {
  const { method, url } = parsed.http;

  // docs 블록에서 JSON 추출
  let responseJson: any = null;
  
  if (parsed.docs) {
    responseJson = extractJsonFromDocs(parsed.docs);
  }
  
  // docs가 없거나 유효하지 않으면 기본 응답 사용
  if (!responseJson) {
    // 기본 응답 생성 (테스트 용)
    if (method === 'GET') {
      responseJson = { message: 'Mock response', data: null };
    } else if (['POST', 'PUT', 'PATCH'].includes(method)) {
      responseJson = { message: 'Success', id: 1 };
    } else if (method === 'DELETE') {
      responseJson = { message: 'Deleted successfully' };
    } else {
      responseJson = { message: 'Mock response' };
    }
  }

  const handlerName = generateHandlerName(method, url);

  // MSW 핸들러 코드 생성
  const content = generateHandlerCode(method, url, responseJson);

  return {
    domain,
    fileName: `${handlerName}.ts`,
    content,
  };
}

/**
 * 핸들러 파일명 생성
 */
function generateHandlerName(method: string, url: string): string {
  // URL에서 경로 추출 및 클린업
  const cleanUrl = url
    .split('?')[0] // 쿼리 파라미터 제거
    .replace(/^\//, '') // 시작 슬래시 제거
    .replace(/\//g, '-') // 슬래시를 하이픈으로
    .replace(/:/g, '') // 콜론 제거 (path param)
    .replace(/\{|\}/g, ''); // 중괄호 제거

  return `${method.toLowerCase()}-${cleanUrl}`;
}

/**
 * MSW 핸들러 코드 생성
 */
function generateHandlerCode(method: string, url: string, responseData: any): string {
  const httpMethod = method.toLowerCase();
  const normalizedUrl = normalizeUrl(url);
  const responseJsonStr = JSON.stringify(responseData, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `    ${line}`))
    .join('\n');

  return `import { http, HttpResponse } from 'msw';

/**
 * ${method.toUpperCase()} ${url}
 * Auto-generated MSW handler
 */
export const handler = http.${httpMethod}('${normalizedUrl}', () => {
  return HttpResponse.json(
    ${responseJsonStr}
  );
});
`;
}

/**
 * URL 정규화
 * :param -> {param} 형식으로 변환 (MSW에서 사용)
 */
function normalizeUrl(url: string): string {
  // :param을 :param 형식으로 유지 (MSW는 :param 형식 지원)
  return url;
}

/**
 * 도메인별 핸들러 통합 파일 생성
 */
export function generateDomainHandlersIndex(
  domain: string,
  handlers: { fileName: string; handlerName: string }[]
): string {
  const imports = handlers
    .map((h, index) => {
      const varName = `handler${index + 1}`;
      const importPath = `./${h.fileName.replace('.ts', '')}`;
      return `import { handler as ${varName} } from '${importPath}';`;
    })
    .join('\n');

  const exportArray = handlers
    .map((_, index) => `  handler${index + 1}`)
    .join(',\n');

  return `${imports}

/**
 * ${domain} domain MSW handlers
 * Auto-generated from Bruno files
 */
export const ${domain}Handlers = [
${exportArray}
];
`;
}

/**
 * 전체 핸들러 통합 파일 생성
 */
export function generateMSWIndex(domains: string[]): string {
  const imports = domains
    .map(domain => `import { ${domain}Handlers } from './${domain}';`)
    .join('\n');

  const exportArray = domains
    .map(domain => `  ...${domain}Handlers`)
    .join(',\n');

  return `${imports}

/**
 * All MSW handlers
 * Auto-generated from Bruno files
 * 
 * 프론트엔드에서 플래그로 활성/비활성 제어:
 * 
 * 예시 1: 환경 변수로 제어
 * const ENABLE_MSW = process.env.NEXT_PUBLIC_ENABLE_MSW === 'true';
 * export const handlers = ENABLE_MSW ? [
 *   ${exportArray}
 * ] : [];
 * 
 * 예시 2: 특정 도메인만 활성화
 * export const handlers = [
 *   ...authHandlers,  // Auth 도메인만 활성화
 *   // ...usersHandlers,  // Users 도메인 비활성화
 * ];
 * 
 * 예시 3: 조건부 필터링
 * const enabledDomains = ['Auth', 'Users']; // 활성화할 도메인 목록
 * export const handlers = [
 *   ${domains.map(d => `...(enabledDomains.includes('${d}') ? ${d}Handlers : [])`).join(',\n  ')}
 * ];
 */
export const handlers = [
${exportArray}
];
`;
}
