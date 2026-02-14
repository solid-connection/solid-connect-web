/**
 * API 팩토리 생성기
 * 도메인별로 모든 API 함수를 객체로 묶어서 export
 */

import { ParsedBrunoFile, extractJsonFromDocs } from '../parser/bruParser';
import { ApiFunction } from './apiClientGenerator';
import { generateTypeScriptInterface, toCamelCase, functionNameToTypeName } from './typeGenerator';

/**
 * 빈 인터페이스를 Record<string, never> 타입으로 변환
 */
function convertEmptyInterfaceToType(content: string, typeName: string): string {
  // 빈 인터페이스 패턴: export interface TypeName { }
  const emptyInterfacePattern = new RegExp(`export interface ${typeName}\\s*\\{\\s*\\}`);
  if (emptyInterfacePattern.test(content)) {
    return `export type ${typeName} = Record<string, never>;`;
  }
  return content;
}

/**
 * 팩토리용 API 함수 코드 생성 (객체 속성으로 사용)
 */
function generateApiFunctionForFactory(apiFunc: ApiFunction, parsed: ParsedBrunoFile): string {
  const { name, method, url, responseType, hasParams, hasBody } = apiFunc;

  const lines: string[] = [];

  // 파라미터 인터페이스 생성
  const paramsList: string[] = [];
  const urlParams: string[] = [];

  // URL 생성 로직
  // 1. {{URL}} 제거
  let processedUrl = url.replace(/\{\{URL\}\}/g, '');

  // 2. 브루노 변수 {{변수명}} 처리 (URL 파라미터로 변환)
  const brunoVarPattern = /\{\{([^}]+)\}\}/g;
  let match;
  const processedBrunoVars = new Set<string>();

  while ((match = brunoVarPattern.exec(processedUrl)) !== null) {
    const varName = match[1];
    // URL 변수는 제외
    if (varName === 'URL') continue;
    
    const camelVarName = varName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (!urlParams.includes(camelVarName) && !processedBrunoVars.has(camelVarName)) {
      urlParams.push(camelVarName);
      paramsList.push(`${camelVarName}: string | number`);
      processedBrunoVars.add(camelVarName);
    }
    processedUrl = processedUrl.replace(match[0], `\${params.${camelVarName}}`);
  }

  // 3. 기존 URL 파라미터 패턴 처리 (:param, {param})
  const urlParamMatches = processedUrl.matchAll(/:(\w+)|\{(\w+)\}/g);
  for (const match of urlParamMatches) {
    const paramName = match[1] || match[2];
    if (!urlParams.includes(paramName) && !processedBrunoVars.has(paramName)) {
      urlParams.push(paramName);
      paramsList.push(`${paramName}: string | number`);
    }
    processedUrl = processedUrl.replace(`:${paramName}`, `\${params.${paramName}}`);
    processedUrl = processedUrl.replace(`{${paramName}}`, `\${params.${paramName}}`);
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

  let urlExpression = `\`${processedUrl}\``;

  // 함수 생성 (화살표 함수로)
  lines.push(`async (${paramsType}): Promise<${responseType}> => {`);

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
  lines.push(`}`);

  return lines.join('\n');
}

/**
 * 도메인별 API 팩토리 파일 생성
 */
export function generateApiFactory(
  apiFunctions: Array<{ apiFunc: ApiFunction; parsed: ParsedBrunoFile }>,
  domain: string,
  axiosInstancePath: string
): string {
  const lines: string[] = [
    `import { axiosInstance } from "${axiosInstancePath}";`,
    '',
  ];

  // 모든 타입 정의 수집
  const typeDefinitions = new Set<string>();

  for (const { apiFunc, parsed } of apiFunctions) {
    const { responseType } = apiFunc;
    const requestType = responseType.replace('Response', 'Request');

    // Response 타입 생성
    if (parsed.docs) {
      const jsonData = extractJsonFromDocs(parsed.docs);
      if (jsonData !== null && jsonData !== undefined) {
        // 빈 객체 체크
        if (typeof jsonData === 'object' && !Array.isArray(jsonData) && Object.keys(jsonData).length === 0) {
          // 빈 객체인 경우 Record<string, never> 타입 생성
          const emptyType = `export type ${responseType} = Record<string, never>;`;
          if (!typeDefinitions.has(emptyType)) {
            typeDefinitions.add(emptyType);
            lines.push(emptyType);
            lines.push('');
          }
        } else {
          const typeDefs = generateTypeScriptInterface(jsonData, responseType);
          for (const typeDef of typeDefs) {
            // 빈 인터페이스 체크 및 변환
            const processedContent = convertEmptyInterfaceToType(typeDef.content, responseType);
            if (!typeDefinitions.has(processedContent)) {
              typeDefinitions.add(processedContent);
              lines.push(processedContent);
              lines.push('');
            }
          }
        }
      } else {
        // JSON 추출 실패 시 void 타입 생성
        const defaultType = `export type ${responseType} = void;`;
        if (!typeDefinitions.has(defaultType)) {
          typeDefinitions.add(defaultType);
          lines.push(defaultType);
          lines.push('');
        }
      }
    } else {
      // Response가 없으면 void 타입 사용
      const defaultType = `export type ${responseType} = void;`;
      if (!typeDefinitions.has(defaultType)) {
        typeDefinitions.add(defaultType);
        lines.push(defaultType);
        lines.push('');
      }
    }

    // Request 타입 생성 (POST, PUT, PATCH인 경우)
    if (['POST', 'PUT', 'PATCH'].includes(apiFunc.method)) {
      if (parsed.body?.content) {
        try {
          const bodyData = JSON.parse(parsed.body.content);
          const requestTypeDefs = generateTypeScriptInterface(bodyData, requestType);
          for (const typeDef of requestTypeDefs) {
            if (!typeDefinitions.has(typeDef.content)) {
              typeDefinitions.add(typeDef.content);
              lines.push(typeDef.content);
              lines.push('');
            }
          }
        } catch {
          // Request body 파싱 실패시 Record<string, never> 사용
          const defaultRequestType = `export type ${requestType} = Record<string, never>;`;
          if (!typeDefinitions.has(defaultRequestType)) {
            typeDefinitions.add(defaultRequestType);
            lines.push(defaultRequestType);
            lines.push('');
          }
        }
      } else {
        // Request body가 없으면 Record<string, never> 사용
        const defaultRequestType = `export type ${requestType} = Record<string, never>;`;
        if (!typeDefinitions.has(defaultRequestType)) {
          typeDefinitions.add(defaultRequestType);
          lines.push(defaultRequestType);
          lines.push('');
        }
      }
    }
  }

  // 팩토리 객체 생성
  const factoryName = `${toCamelCase(domain)}Api`;
  lines.push(`export const ${factoryName} = {`);

  for (const { apiFunc, parsed } of apiFunctions) {
    const functionCode = generateApiFunctionForFactory(apiFunc, parsed);
    // 들여쓰기 추가 (2칸)
    const indentedCode = functionCode.split('\n').map((line, index) => {
      if (index === 0) return `  ${apiFunc.name}: ${line}`;
      return `  ${line}`;
    }).join('\n');
    lines.push(indentedCode + ',');
    lines.push('');
  }

  lines.push(`};`);

  return lines.join('\n');
}
