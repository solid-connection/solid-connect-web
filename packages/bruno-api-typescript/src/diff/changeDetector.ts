/**
 * API 변경사항 자동 감지
 * 이전 버전과 현재 버전의 OpenAPI 스펙을 비교하여 변경사항을 추출
 */

import { readFileSync, existsSync } from 'fs';
import { OpenAPISpec } from '../converter/openapiConverter';

export type ChangeType = 'added' | 'removed' | 'modified';
export type ChangeSeverity = 'breaking' | 'minor' | 'patch';

export interface FieldChange {
  type: 'added' | 'removed' | 'type-changed' | 'required-changed';
  field: string;
  path: string;
  oldValue?: any;
  newValue?: any;
}

export interface EndpointChange {
  type: ChangeType;
  severity: ChangeSeverity;
  domain: string;
  path: string;
  method: string;
  changes?: FieldChange[];
  description: string;
}

export interface ChangeReport {
  timestamp: string;
  summary: {
    added: number;
    removed: number;
    modified: number;
    breaking: number;
  };
  changes: EndpointChange[];
}

/**
 * 두 OpenAPI 스펙 간 변경사항 감지
 */
export function detectChanges(oldSpecPath: string, newSpecPath: string): ChangeReport {
  // 파일 존재 확인
  if (!existsSync(oldSpecPath)) {
    throw new Error(`Old spec file not found: ${oldSpecPath}`);
  }
  if (!existsSync(newSpecPath)) {
    throw new Error(`New spec file not found: ${newSpecPath}`);
  }

  const oldSpec: OpenAPISpec = JSON.parse(readFileSync(oldSpecPath, 'utf-8'));
  const newSpec: OpenAPISpec = JSON.parse(readFileSync(newSpecPath, 'utf-8'));

  const changes: EndpointChange[] = [];

  // 모든 경로와 메서드 수집
  const allPaths = new Set([
    ...Object.keys(oldSpec.paths || {}),
    ...Object.keys(newSpec.paths || {}),
  ]);

  for (const path of allPaths) {
    const oldPath = oldSpec.paths?.[path];
    const newPath = newSpec.paths?.[path];

    // 경로가 추가됨
    if (!oldPath && newPath) {
      for (const method of Object.keys(newPath)) {
        if (isHttpMethod(method)) {
          changes.push({
            type: 'added',
            severity: 'minor',
            domain: extractDomain(newPath[method]),
            path,
            method: method.toUpperCase(),
            description: `New endpoint: ${method.toUpperCase()} ${path}`,
          });
        }
      }
      continue;
    }

    // 경로가 제거됨
    if (oldPath && !newPath) {
      for (const method of Object.keys(oldPath)) {
        if (isHttpMethod(method)) {
          changes.push({
            type: 'removed',
            severity: 'breaking',
            domain: extractDomain(oldPath[method]),
            path,
            method: method.toUpperCase(),
            description: `Endpoint removed: ${method.toUpperCase()} ${path}`,
          });
        }
      }
      continue;
    }

    // 경로가 수정됨 - 메서드별로 비교
    if (oldPath && newPath) {
      const allMethods = new Set([...Object.keys(oldPath), ...Object.keys(newPath)]);

      for (const method of allMethods) {
        if (!isHttpMethod(method)) continue;

        const oldMethod = oldPath[method];
        const newMethod = newPath[method];

        // 메서드가 추가됨
        if (!oldMethod && newMethod) {
          changes.push({
            type: 'added',
            severity: 'minor',
            domain: extractDomain(newMethod),
            path,
            method: method.toUpperCase(),
            description: `New method: ${method.toUpperCase()} ${path}`,
          });
          continue;
        }

        // 메서드가 제거됨
        if (oldMethod && !newMethod) {
          changes.push({
            type: 'removed',
            severity: 'breaking',
            domain: extractDomain(oldMethod),
            path,
            method: method.toUpperCase(),
            description: `Method removed: ${method.toUpperCase()} ${path}`,
          });
          continue;
        }

        // 메서드가 수정됨 - 스키마 비교
        if (oldMethod && newMethod) {
          const fieldChanges = compareSchemas(oldMethod, newMethod);

          if (fieldChanges.length > 0) {
            const hasBreaking = fieldChanges.some(
              (fc) => fc.type === 'removed' || fc.type === 'type-changed'
            );

            changes.push({
              type: 'modified',
              severity: hasBreaking ? 'breaking' : 'minor',
              domain: extractDomain(newMethod),
              path,
              method: method.toUpperCase(),
              changes: fieldChanges,
              description: `Schema changed: ${method.toUpperCase()} ${path}`,
            });
          }
        }
      }
    }
  }

  // 요약 계산
  const summary = {
    added: changes.filter((c) => c.type === 'added').length,
    removed: changes.filter((c) => c.type === 'removed').length,
    modified: changes.filter((c) => c.type === 'modified').length,
    breaking: changes.filter((c) => c.severity === 'breaking').length,
  };

  return {
    timestamp: new Date().toISOString(),
    summary,
    changes,
  };
}

/**
 * HTTP 메서드 확인
 */
function isHttpMethod(method: string): boolean {
  const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];
  return methods.includes(method.toLowerCase());
}

/**
 * 도메인 추출
 * "한글명 [EnglishKey]" 형식에서 EnglishKey만 추출
 */
function extractDomain(operation: any): string {
  if (operation.tags && operation.tags.length > 0) {
    const tag = operation.tags[0];

    // 대괄호 안의 영문키 추출: 1) 어드민 [Admin] → Admin, 사용자 [users] → users
    const bracketPattern = /\[([^\]]+)\]/;
    const bracketMatch = tag.match(bracketPattern);
    if (bracketMatch) {
      return bracketMatch[1].trim(); // 대괄호 안의 영문키
    }

    return tag;
  }
  return 'default';
}

/**
 * 두 operation의 스키마 비교
 */
function compareSchemas(oldOp: any, newOp: any): FieldChange[] {
  const changes: FieldChange[] = [];

  // Response 스키마 비교 (200 응답)
  const oldResponse = oldOp.responses?.['200']?.content?.['application/json']?.schema;
  const newResponse = newOp.responses?.['200']?.content?.['application/json']?.schema;

  if (oldResponse && newResponse) {
    compareObjectSchemas('response', oldResponse, newResponse, changes);
  } else if (!oldResponse && newResponse) {
    changes.push({
      type: 'added',
      field: 'response',
      path: 'response',
      newValue: 'object',
    });
  } else if (oldResponse && !newResponse) {
    changes.push({
      type: 'removed',
      field: 'response',
      path: 'response',
      oldValue: 'object',
    });
  }

  // Request body 비교
  const oldRequestBody = oldOp.requestBody?.content?.['application/json']?.schema;
  const newRequestBody = newOp.requestBody?.content?.['application/json']?.schema;

  if (oldRequestBody && newRequestBody) {
    compareObjectSchemas('requestBody', oldRequestBody, newRequestBody, changes);
  }

  return changes;
}

/**
 * 객체 스키마 재귀적 비교
 */
function compareObjectSchemas(
  basePath: string,
  oldSchema: any,
  newSchema: any,
  changes: FieldChange[]
): void {
  // 타입이 다른 경우
  if (oldSchema.type !== newSchema.type) {
    changes.push({
      type: 'type-changed',
      field: basePath.split('.').pop() || basePath,
      path: basePath,
      oldValue: oldSchema.type,
      newValue: newSchema.type,
    });
    return;
  }

  // 배열인 경우 - items 비교
  if (oldSchema.type === 'array' && newSchema.type === 'array') {
    if (oldSchema.items && newSchema.items) {
      compareObjectSchemas(`${basePath}[]`, oldSchema.items, newSchema.items, changes);
    }
    return;
  }

  // 객체인 경우 - properties 비교
  if (oldSchema.type === 'object' && newSchema.type === 'object') {
    const oldProps = oldSchema.properties || {};
    const newProps = newSchema.properties || {};

    const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);

    for (const key of allKeys) {
      const oldProp = oldProps[key];
      const newProp = newProps[key];
      const fieldPath = `${basePath}.${key}`;

      // 필드가 추가됨
      if (!oldProp && newProp) {
        changes.push({
          type: 'added',
          field: key,
          path: fieldPath,
          newValue: newProp.type,
        });
        continue;
      }

      // 필드가 제거됨
      if (oldProp && !newProp) {
        changes.push({
          type: 'removed',
          field: key,
          path: fieldPath,
          oldValue: oldProp.type,
        });
        continue;
      }

      // 필드가 수정됨
      if (oldProp && newProp) {
        // 타입 변경
        if (oldProp.type !== newProp.type) {
          changes.push({
            type: 'type-changed',
            field: key,
            path: fieldPath,
            oldValue: oldProp.type,
            newValue: newProp.type,
          });
        }

        // 중첩 객체/배열 재귀 비교
        if (oldProp.type === 'object' || oldProp.type === 'array') {
          compareObjectSchemas(fieldPath, oldProp, newProp, changes);
        }
      }
    }
  }
}

/**
 * 변경사항이 Breaking인지 확인
 */
export function isBreakingChange(change: EndpointChange): boolean {
  return change.severity === 'breaking';
}

/**
 * 도메인별로 변경사항 그룹화
 */
export function groupChangesByDomain(changes: EndpointChange[]): Map<string, EndpointChange[]> {
  const grouped = new Map<string, EndpointChange[]>();

  for (const change of changes) {
    if (!grouped.has(change.domain)) {
      grouped.set(change.domain, []);
    }
    grouped.get(change.domain)!.push(change);
  }

  return grouped;
}
