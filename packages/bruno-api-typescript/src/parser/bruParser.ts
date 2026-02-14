/**
 * Bruno .bru 파일 파서
 * .bru 파일을 읽어서 구조화된 데이터로 변환
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

export interface BrunoRequest {
  method: string;
  url: string;
  name: string;
  docs?: string;
  headers?: Record<string, string>;
  body?: string;
  auth?: {
    type: string;
    [key: string]: any;
  };
}

export interface ParsedBrunoFile {
  meta: {
    name: string;
    type: string;
    seq?: number;
    done?: boolean;
  };
  http: {
    method: string;
    url: string;
  };
  headers?: Record<string, string>;
  auth?: {
    type: string;
    [key: string]: any;
  };
  body?: {
    type: string;
    content: string;
  };
  docs?: string;
  script?: {
    pre?: string;
    post?: string;
  };
  tests?: string;
}

/**
 * .bru 파일 파싱
 */
export function parseBrunoFile(filePath: string): ParsedBrunoFile {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const result: ParsedBrunoFile = {
    meta: {
      name: '',
      type: 'http',
    },
    http: {
      method: 'GET',
      url: '',
    },
  };

  let currentBlock: string | null = null;
  let blockContent: string[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 블록 시작 감지
    if (trimmed === 'meta {') {
      currentBlock = 'meta';
      blockContent = [];
      continue;
    } else if (trimmed.match(/^(get|post|put|patch|delete|head|options)\s*\{/i)) {
      // HTTP 메서드 블록 형식: put { url: ... }
      const match = trimmed.match(/^(get|post|put|patch|delete|head|options)\s*\{/i);
      if (match) {
        result.http.method = match[1].toUpperCase();
        currentBlock = 'http';
        blockContent = [];
        continue;
      }
    } else if (trimmed.match(/^(get|post|put|patch|delete|head|options)\s+/i)) {
      // HTTP 메서드 라인 형식: get /api/endpoint
      const match = trimmed.match(/^(get|post|put|patch|delete|head|options)\s+(.+)$/i);
      if (match) {
        result.http.method = match[1].toUpperCase();
        result.http.url = match[2].trim();
      }
      continue;
    } else if (trimmed === 'headers {') {
      currentBlock = 'headers';
      blockContent = [];
      continue;
    } else if (trimmed === 'body:json {') {
      currentBlock = 'body';
      blockContent = [];
      continue;
    } else if (trimmed === 'docs {') {
      currentBlock = 'docs';
      blockContent = [];
      inCodeBlock = false;
      continue;
    } else if (trimmed === 'script:pre-request {') {
      currentBlock = 'script:pre';
      blockContent = [];
      continue;
    } else if (trimmed === 'script:post-response {') {
      currentBlock = 'script:post';
      blockContent = [];
      continue;
    } else if (trimmed === 'tests {') {
      currentBlock = 'tests';
      blockContent = [];
      continue;
    }

    // 블록 종료 감지
    if (trimmed === '}' && currentBlock && !inCodeBlock) {
      // 블록 파싱
      parseBlock(result, currentBlock, blockContent);
      currentBlock = null;
      blockContent = [];
      continue;
    }

    // 블록 내용 수집
    if (currentBlock) {
      // docs 블록에서 코드 블록 처리
      if (currentBlock === 'docs') {
        if (trimmed === '```json' || trimmed === '```') {
          inCodeBlock = !inCodeBlock;
          // 코드 블록 라인도 포함 (정규식 매칭을 위해)
          blockContent.push(line);
          continue;
        }
      }
      blockContent.push(line);
    }
  }

  return result;
}

/**
 * 블록 파싱
 */
function parseBlock(result: ParsedBrunoFile, blockName: string, content: string[]): void {
  switch (blockName) {
    case 'meta':
      parseMeta(result, content);
      break;
    case 'http':
      parseHttp(result, content);
      break;
    case 'headers':
      parseHeaders(result, content);
      break;
    case 'body':
      parseBody(result, content);
      break;
    case 'docs':
      parseDocs(result, content);
      break;
    case 'script:pre':
      if (!result.script) result.script = {};
      result.script.pre = content.join('\n').trim();
      break;
    case 'script:post':
      if (!result.script) result.script = {};
      result.script.post = content.join('\n').trim();
      break;
    case 'tests':
      result.tests = content.join('\n').trim();
      break;
  }
}

/**
 * HTTP 블록 파싱 (put { url: ... } 형식)
 */
function parseHttp(result: ParsedBrunoFile, lines: string[]): void {
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('url:')) {
      result.http.url = trimmed.substring(4).trim();
    }
  }
}

/**
 * meta 블록 파싱
 */
function parseMeta(result: ParsedBrunoFile, lines: string[]): void {
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('name:')) {
      result.meta.name = trimmed.substring(5).trim();
    } else if (trimmed.startsWith('type:')) {
      result.meta.type = trimmed.substring(5).trim();
    } else if (trimmed.startsWith('seq:')) {
      result.meta.seq = parseInt(trimmed.substring(4).trim(), 10);
    } else if (trimmed.startsWith('done:')) {
      const value = trimmed.substring(5).trim().toLowerCase();
      result.meta.done = value === 'true';
    }
  }
}

/**
 * headers 블록 파싱
 */
function parseHeaders(result: ParsedBrunoFile, lines: string[]): void {
  result.headers = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();
      result.headers[key] = value;
    }
  }
}

/**
 * body 블록 파싱
 */
function parseBody(result: ParsedBrunoFile, lines: string[]): void {
  const content = lines.join('\n').trim();
  result.body = {
    type: 'json',
    content,
  };
}

/**
 * docs 블록 파싱 (JSON 추출)
 */
function parseDocs(result: ParsedBrunoFile, lines: string[]): void {
  const content = lines.join('\n').trim();
  result.docs = content;
}

/**
 * docs 블록에서 JSON 추출
 * 상태 코드별 응답 지원: ## 200 OK 형식
 */
export function extractJsonFromDocs(docs: string): any {
  try {
    // ## 200 OK 형식의 상태 코드별 응답 지원
    // 패턴: ## 200 OK (또는 ## 200) 다음에 빈 줄과 코드 블록
    const statusCodePattern = /##\s*(\d+)\s+[^\n]*(?:\n|$)(?:[^\n]*\n)*?\s*```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/g;
    let match;
    let json200 = null;
    
    // 모든 상태 코드 응답 찾기
    while ((match = statusCodePattern.exec(docs)) !== null) {
      const statusCode = parseInt(match[1]);
      const jsonContent = match[2].trim();
      
      // 200 OK만 사용
      if (statusCode === 200) {
        try {
          json200 = JSON.parse(jsonContent);
          break; // 200 OK를 찾으면 중단
        } catch (e) {
          // JSON 파싱 실패시 무시
        }
      }
    }
    
    // 200 OK를 찾지 못한 경우 기존 로직 사용
    if (json200) {
      return json200;
    }
    
    // 기존 로직: 단일 JSON 코드 블록
    const jsonMatch = docs.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1].trim());
    }

    // 일반 JSON 파싱 시도
    return JSON.parse(docs.trim());
  } catch (error) {
    return null;
  }
}
