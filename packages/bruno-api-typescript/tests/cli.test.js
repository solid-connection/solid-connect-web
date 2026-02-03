/**
 * CLI 기능 테스트
 * Node.js 기본 test runner 사용
 */

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const { existsSync, rmSync, mkdirSync, readFileSync } = require('fs');
const { execSync } = require('child_process');
const { join } = require('path');

const FIXTURES_DIR = join(__dirname, 'fixtures');
const TEST_OUTPUT_DIR = join(__dirname, 'output');

// 테스트 전 정리
before(() => {
  if (existsSync(TEST_OUTPUT_DIR)) {
    rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
  }
  mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
});

// 테스트 후 정리
after(() => {
  if (existsSync(TEST_OUTPUT_DIR)) {
    rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
  }
});

describe('OpenAPI 생성 테스트', () => {
  test('기본 OpenAPI 스펙 생성', () => {
    const inputDir = join(FIXTURES_DIR, 'bruno');
    const outputFile = join(TEST_OUTPUT_DIR, 'openapi.json');

    // CLI 실행
    execSync(`node dist/cli/index.js generate -i ${inputDir} -o ${outputFile}`, {
      cwd: join(__dirname, '..'),
    });

    // 파일 생성 확인
    assert.ok(existsSync(outputFile), 'OpenAPI 파일이 생성되어야 함');

    // JSON 파싱 가능 확인
    const spec = JSON.parse(readFileSync(outputFile, 'utf-8'));

    // 기본 구조 검증
    assert.ok(spec.openapi, 'openapi 버전이 있어야 함');
    assert.ok(spec.info, 'info 객체가 있어야 함');
    assert.ok(spec.paths, 'paths 객체가 있어야 함');

    // 엔드포인트 확인
    assert.ok(spec.paths['/users/profile'], '/users/profile 엔드포인트가 있어야 함');
    assert.ok(spec.paths['/applications/competitors'], '/applications/competitors 엔드포인트가 있어야 함');

    // GET 메서드 확인
    assert.ok(spec.paths['/users/profile'].get, 'GET /users/profile가 있어야 함');
    assert.ok(spec.paths['/applications/competitors'].get, 'GET /applications/competitors가 있어야 함');

    console.log('✅ OpenAPI 생성 테스트 통과');
  });

  test('도메인별 태그 그룹화', () => {
    const inputDir = join(FIXTURES_DIR, 'bruno');
    const outputFile = join(TEST_OUTPUT_DIR, 'openapi-tags.json');

    execSync(`node dist/cli/index.js generate -i ${inputDir} -o ${outputFile}`, {
      cwd: join(__dirname, '..'),
    });

    const spec = JSON.parse(readFileSync(outputFile, 'utf-8'));

    // 태그 확인
    assert.ok(spec.paths['/users/profile'].get.tags, '태그가 있어야 함');
    assert.ok(spec.paths['/users/profile'].get.tags.includes('users'), 'users 태그가 있어야 함');

    console.log('✅ 도메인별 태그 그룹화 테스트 통과');
  });

  test('응답 스키마 생성', () => {
    const inputDir = join(FIXTURES_DIR, 'bruno');
    const outputFile = join(TEST_OUTPUT_DIR, 'openapi-schema.json');

    execSync(`node dist/cli/index.js generate -i ${inputDir} -o ${outputFile}`, {
      cwd: join(__dirname, '..'),
    });

    const spec = JSON.parse(readFileSync(outputFile, 'utf-8'));

    // 응답 스키마 확인
    const userProfileResponse = spec.paths['/users/profile'].get.responses['200'];
    assert.ok(userProfileResponse, '200 응답이 있어야 함');
    assert.ok(userProfileResponse.content, 'content가 있어야 함');
    assert.ok(userProfileResponse.content['application/json'], 'application/json이 있어야 함');
    assert.ok(userProfileResponse.content['application/json'].schema, 'schema가 있어야 함');

    const schema = userProfileResponse.content['application/json'].schema;
    assert.ok(schema.properties, 'properties가 있어야 함');
    assert.ok(schema.properties.id, 'id 필드가 있어야 함');
    assert.ok(schema.properties.username, 'username 필드가 있어야 함');

    console.log('✅ 응답 스키마 생성 테스트 통과');
  });
});

describe('API 클라이언트 생성 테스트', () => {
  test('기본 API 파일 생성', () => {
    const inputDir = join(FIXTURES_DIR, 'bruno');
    const outputDir = join(TEST_OUTPUT_DIR, 'apis');

    execSync(`node dist/cli/index.js generate-hooks -i ${inputDir} -o ${outputDir}`, {
      cwd: join(__dirname, '..'),
    });

    const usersDir = join(outputDir, 'users');
    const applicationsDir = join(outputDir, 'applications');
    assert.ok(existsSync(usersDir), 'users 디렉토리가 생성되어야 함');
    assert.ok(existsSync(applicationsDir), 'applications 디렉토리가 생성되어야 함');

    const usersApiFile = join(usersDir, 'api.ts');
    const applicationsApiFile = join(applicationsDir, 'api.ts');
    assert.ok(existsSync(usersApiFile), 'users/api.ts 팩토리 파일이 생성되어야 함');
    assert.ok(existsSync(applicationsApiFile), 'applications/api.ts 팩토리 파일이 생성되어야 함');

    const usersDefinitionsFile = join(usersDir, 'apiDefinitions.ts');
    const applicationsDefinitionsFile = join(applicationsDir, 'apiDefinitions.ts');
    assert.ok(existsSync(usersDefinitionsFile), 'users/apiDefinitions.ts 파일이 생성되어야 함');
    assert.ok(existsSync(applicationsDefinitionsFile), 'applications/apiDefinitions.ts 파일이 생성되어야 함');

    console.log('✅ 기본 API 파일 생성 테스트 통과');
  });

  test('API 정의 파일 내용 검증', () => {
    const inputDir = join(FIXTURES_DIR, 'bruno');
    const outputDir = join(TEST_OUTPUT_DIR, 'apis-content');

    execSync(`node dist/cli/index.js generate-hooks -i ${inputDir} -o ${outputDir}`, {
      cwd: join(__dirname, '..'),
    });

    const usersDefinitionsFile = join(outputDir, 'users', 'apiDefinitions.ts');
    const content = readFileSync(usersDefinitionsFile, 'utf-8');

    assert.ok(content.includes('import type'), 'type-only import가 있어야 함');
    assert.ok(content.includes('from \'./api\''), 'api.ts로부터 타입 import가 있어야 함');
    assert.ok(content.includes('export const usersApiDefinitions'), 'usersApiDefinitions 객체가 있어야 함');
    assert.ok(content.includes('method:'), 'method 필드가 있어야 함');
    assert.ok(content.includes('path:'), 'path 필드가 있어야 함');
    assert.ok(content.includes('response:'), 'response 필드가 있어야 함');

    console.log('✅ API 정의 파일 내용 검증 테스트 통과');
  });

  test('API 팩토리 파일 내용 검증', () => {
    const inputDir = join(FIXTURES_DIR, 'bruno');
    const outputDir = join(TEST_OUTPUT_DIR, 'apis-factory');

    execSync(`node dist/cli/index.js generate-hooks -i ${inputDir} -o ${outputDir}`, {
      cwd: join(__dirname, '..'),
    });

    const usersApiFile = join(outputDir, 'users', 'api.ts');
    const content = readFileSync(usersApiFile, 'utf-8');

    // 필수 import 확인
    assert.ok(content.includes('import { axiosInstance }'), 'axiosInstance import가 있어야 함');

    // 팩토리 객체 확인
    assert.ok(content.includes('export const usersApi'), 'usersApi 팩토리 객체가 있어야 함');
    assert.ok(content.includes('getGetProfile:'), 'getGetProfile 함수가 있어야 함');

    // 함수 시그니처 확인
    assert.ok(content.includes('async ('), 'async 함수가 있어야 함');
    assert.ok(content.includes('Promise<'), 'Promise 타입이 있어야 함');

    console.log('✅ API 팩토리 파일 내용 검증 테스트 통과');
  });

  test('index 파일 생성', () => {
    const inputDir = join(FIXTURES_DIR, 'bruno');
    const outputDir = join(TEST_OUTPUT_DIR, 'apis-index');

    execSync(`node dist/cli/index.js generate-hooks -i ${inputDir} -o ${outputDir}`, {
      cwd: join(__dirname, '..'),
    });

    const usersIndex = join(outputDir, 'users', 'index.ts');
    const applicationsIndex = join(outputDir, 'applications', 'index.ts');

    assert.ok(existsSync(usersIndex), 'users/index.ts가 생성되어야 함');
    assert.ok(existsSync(applicationsIndex), 'applications/index.ts가 생성되어야 함');

    const usersIndexContent = readFileSync(usersIndex, 'utf-8');
    assert.ok(usersIndexContent.includes('export'), 'export가 있어야 함');
    assert.ok(usersIndexContent.includes('usersApi'), 'usersApi export가 있어야 함');
    assert.ok(usersIndexContent.includes('apiDefinitions'), 'apiDefinitions export가 있어야 함');

    console.log('✅ index 파일 생성 테스트 통과');
  });
});

describe('변경사항 감지 테스트', () => {
  test('변경사항 감지 기능', () => {
    const brunoV1 = join(FIXTURES_DIR, 'bruno');
    const brunoV2 = join(FIXTURES_DIR, 'bruno-v2');
    const outputV1 = join(TEST_OUTPUT_DIR, 'openapi-v1.json');
    const outputV2 = join(TEST_OUTPUT_DIR, 'openapi-v2.json');

    // V1 생성
    execSync(`node dist/cli/index.js generate -i ${brunoV1} -o ${outputV1}`, {
      cwd: join(__dirname, '..'),
    });

    // V2 생성 (변경사항 포함)
    execSync(`node dist/cli/index.js generate -i ${brunoV2} -o ${outputV2}`, {
      cwd: join(__dirname, '..'),
    });

    // 파일 비교
    const specV1 = JSON.parse(readFileSync(outputV1, 'utf-8'));
    const specV2 = JSON.parse(readFileSync(outputV2, 'utf-8'));

    // V2에 추가된 엔드포인트 확인
    const v1Paths = Object.keys(specV1.paths);
    const v2Paths = Object.keys(specV2.paths);

    assert.ok(v2Paths.length >= v1Paths.length, 'V2가 V1보다 많거나 같은 엔드포인트를 가져야 함');

    console.log('✅ 변경사항 감지 기능 테스트 통과');
  });
});

describe('새로운 폴더명 패턴 테스트', () => {
  test('숫자) 한글명 [영문키] 패턴 추출', () => {
    const inputDir = join(FIXTURES_DIR, 'bruno');
    const outputDir = join(TEST_OUTPUT_DIR, 'apis-pattern');

    execSync(`node dist/cli/index.js generate-hooks -i ${inputDir} -o ${outputDir}`, {
      cwd: join(__dirname, '..'),
    });

    const adminDir = join(outputDir, 'Admin');
    assert.ok(existsSync(adminDir), '7) 어드민 [Admin] 폴더에서 Admin이 생성되어야 함');

    const apiFile = join(adminDir, 'api.ts');
    const definitionsFile = join(adminDir, 'apiDefinitions.ts');
    assert.ok(existsSync(apiFile), 'Admin/api.ts 파일이 생성되어야 함');
    assert.ok(existsSync(definitionsFile), 'Admin/apiDefinitions.ts 파일이 생성되어야 함');

    console.log('✅ 숫자) 한글명 [영문키] 패턴 테스트 통과');
  });

  test('한글명 [영문키] 파일명 패턴 추출', () => {
    const inputDir = join(FIXTURES_DIR, 'bruno');
    const outputDir = join(TEST_OUTPUT_DIR, 'apis-filename-pattern');

    execSync(`node dist/cli/index.js generate-hooks -i ${inputDir} -o ${outputDir}`, {
      cwd: join(__dirname, '..'),
    });

    const adminApiFile = join(outputDir, 'Admin', 'api.ts');
    const adminApiContent = readFileSync(adminApiFile, 'utf-8');

    assert.ok(adminApiContent.includes('getGetList'), 'getGetList 함수가 생성되어야 함');
    assert.ok(adminApiContent.includes('export const adminApi'), 'adminApi 팩토리가 생성되어야 함');

    const definitionsFile = join(outputDir, 'Admin', 'apiDefinitions.ts');
    const definitionsContent = readFileSync(definitionsFile, 'utf-8');
    assert.ok(definitionsContent.includes('getGetList'), 'getGetList 정의가 생성되어야 함');

    console.log('✅ 한글명 [영문키] 파일명 패턴 테스트 통과');
  });
});

describe('상태 코드별 응답 파싱 테스트', () => {
  test('200 OK만 추출 (404 무시)', () => {
    const inputDir = join(FIXTURES_DIR, 'bruno');
    const outputFile = join(TEST_OUTPUT_DIR, 'openapi-status-codes.json');

    execSync(`node dist/cli/index.js generate -i ${inputDir} -o ${outputFile}`, {
      cwd: join(__dirname, '..'),
    });

    const spec = JSON.parse(readFileSync(outputFile, 'utf-8'));

    // /mentors 엔드포인트 확인
    const mentorsPath = spec.paths['/mentors'];
    assert.ok(mentorsPath, '/mentors 엔드포인트가 있어야 함');

    // 200 응답만 있는지 확인 (404는 무시되어야 함)
    const getMethod = mentorsPath.get;
    assert.ok(getMethod, 'GET 메서드가 있어야 함');
    assert.ok(getMethod.responses['200'], '200 응답이 있어야 함');
    assert.ok(!getMethod.responses['404'], '404 응답은 포함되지 않아야 함');

    // 200 응답의 스키마 확인
    const response200 = getMethod.responses['200'];
    assert.ok(response200.content, 'content가 있어야 함');
    assert.ok(response200.content['application/json'], 'application/json이 있어야 함');
    assert.ok(response200.content['application/json'].schema, 'schema가 있어야 함');

    const schema = response200.content['application/json'].schema;
    assert.ok(schema.properties, 'properties가 있어야 함');
    assert.ok(schema.properties.nextPageNumber, 'nextPageNumber 필드가 있어야 함');
    assert.ok(schema.properties.content, 'content 필드가 있어야 함');

    console.log('✅ 상태 코드별 응답 파싱 테스트 통과');
  });
});

describe('컬렉션 폴더 지원 테스트', () => {
  test('Solid Connection 폴더 제거 및 도메인 추출', () => {
    const collectionFixtureDir = join(TEST_OUTPUT_DIR, 'collection-fixture');
    const collectionDir = join(collectionFixtureDir, 'Solid Connection', '1) 인증 [Auth]');
    mkdirSync(collectionDir, { recursive: true });
    
    const testFile = join(collectionDir, 'sign-out.bru');
    const bruContent = `meta {
  name: Sign Out
  type: http
}

post /auth/sign-out
`;
    require('fs').writeFileSync(testFile, bruContent);

    const outputDir = join(TEST_OUTPUT_DIR, 'collection-output');
    execSync(`node dist/cli/index.js generate-hooks -i ${collectionFixtureDir} -o ${outputDir}`, {
      cwd: join(__dirname, '..'),
    });

    const authDir = join(outputDir, 'Auth');
    assert.ok(existsSync(authDir), 'Auth 디렉토리가 생성되어야 함 (Solid Connection 폴더 제거)');

    const authApiFile = join(authDir, 'api.ts');
    const authApiContent = readFileSync(authApiFile, 'utf-8');
    assert.ok(authApiContent.includes('postSignOut'), 'postSignOut 함수가 생성되어야 함 (메서드 prefix 포함)');

    const authDefinitionsFile = join(authDir, 'apiDefinitions.ts');
    assert.ok(existsSync(authDefinitionsFile), 'Auth/apiDefinitions.ts 파일이 생성되어야 함');

    console.log('✅ Solid Connection 폴더 제거 및 도메인 추출 테스트 통과');
  });
});

describe('파일명 규칙 테스트', () => {
  test('메서드 prefix 없는 파일명 정상 동작 및 함수명에 메서드 prefix 포함', () => {
    const noPrefixFixtureDir = join(TEST_OUTPUT_DIR, 'no-prefix-fixture');
    const usersDir = join(noPrefixFixtureDir, 'users');
    mkdirSync(usersDir, { recursive: true });
    
    const accountFile = join(usersDir, 'account.bru');
    const accountContent = `meta {
  name: Delete Account
  type: http
}

delete /users/account
`;
    require('fs').writeFileSync(accountFile, accountContent);

    const signUpFile = join(usersDir, 'sign-up.bru');
    const signUpContent = `meta {
  name: Sign Up
  type: http
}

post /users/sign-up

body:json {
  {
    "email": "test@example.com",
    "password": "password123"
  }
}

docs {
  \`\`\`json
  {
    "id": 1,
    "email": "test@example.com",
    "createdAt": "2025-01-01T00:00:00Z"
  }
  \`\`\`
}
`;
    require('fs').writeFileSync(signUpFile, signUpContent);

    const outputDir = join(TEST_OUTPUT_DIR, 'no-prefix-output');
    execSync(`node dist/cli/index.js generate-hooks -i ${noPrefixFixtureDir} -o ${outputDir}`, {
      cwd: join(__dirname, '..'),
    });

    const apiFile = join(outputDir, 'users', 'api.ts');
    const apiContent = readFileSync(apiFile, 'utf-8');
    assert.ok(apiContent.includes('deleteAccount'), 'deleteAccount 함수가 생성되어야 함 (메서드 prefix 포함)');
    assert.ok(apiContent.includes('postSignUp'), 'postSignUp 함수가 생성되어야 함 (메서드 prefix 포함)');

    const definitionsFile = join(outputDir, 'users', 'apiDefinitions.ts');
    const definitionsContent = readFileSync(definitionsFile, 'utf-8');
    assert.ok(definitionsContent.includes('deleteAccount'), 'deleteAccount 정의가 생성되어야 함');
    assert.ok(definitionsContent.includes('postSignUp'), 'postSignUp 정의가 생성되어야 함');

    console.log('✅ 메서드 prefix 없는 파일명 및 함수명 메서드 prefix 포함 테스트 통과');
  });
});

describe('빈 타입 생성 테스트', () => {
  test('빈 객체 {}인 경우 Record<string, never> 타입 생성', () => {
    const emptyObjectFixtureDir = join(FIXTURES_DIR, 'bruno-empty-object');
    mkdirSync(emptyObjectFixtureDir, { recursive: true });
    
    // 폴더 구조 생성
    const testFolder = join(emptyObjectFixtureDir, 'test');
    mkdirSync(testFolder, { recursive: true });

    const emptyObjectFile = join(testFolder, 'empty-response.bru');
    const emptyObjectContent = `meta {
  name: Empty Response Test
  type: http
}

get /test/empty

docs {
  \`\`\`json
  {}
  \`\`\`
}
`;
    require('fs').writeFileSync(emptyObjectFile, emptyObjectContent);

    const outputDir = join(TEST_OUTPUT_DIR, 'empty-object-output');
    execSync(`node dist/cli/index.js generate-hooks -i ${emptyObjectFixtureDir} -o ${outputDir}`, {
      cwd: join(__dirname, '..'),
    });

    // api.ts 파일 확인 (도메인은 폴더명 'test'가 됨)
    const apiFile = join(outputDir, 'test', 'api.ts');
    assert.ok(existsSync(apiFile), 'api.ts 파일이 생성되어야 함');

    const apiContent = readFileSync(apiFile, 'utf-8');
    assert.ok(apiContent.includes('Record<string, never>'), '빈 객체는 Record<string, never> 타입이어야 함');
    assert.ok(!apiContent.includes('export interface'), '빈 인터페이스는 생성되지 않아야 함');

    console.log('✅ 빈 객체 Record<string, never> 타입 생성 테스트 통과');
  });

  test('parsed.docs가 있지만 JSON 추출 실패 시 void 타입 생성', () => {
    const invalidJsonFixtureDir = join(FIXTURES_DIR, 'bruno-invalid-json');
    mkdirSync(invalidJsonFixtureDir, { recursive: true });
    
    // 폴더 구조 생성
    const testFolder = join(invalidJsonFixtureDir, 'test');
    mkdirSync(testFolder, { recursive: true });

    const invalidJsonFile = join(testFolder, 'invalid-json.bru');
    const invalidJsonContent = `meta {
  name: Invalid JSON Test
  type: http
}

get /test/invalid

docs {
  이것은 유효하지 않은 JSON입니다
  { invalid json }
}
`;
    require('fs').writeFileSync(invalidJsonFile, invalidJsonContent);

    const outputDir = join(TEST_OUTPUT_DIR, 'invalid-json-output');
    execSync(`node dist/cli/index.js generate-hooks -i ${invalidJsonFixtureDir} -o ${outputDir}`, {
      cwd: join(__dirname, '..'),
    });

    // api.ts 파일 확인 (도메인은 폴더명 'test'가 됨)
    const apiFile = join(outputDir, 'test', 'api.ts');
    assert.ok(existsSync(apiFile), 'api.ts 파일이 생성되어야 함');

    const apiContent = readFileSync(apiFile, 'utf-8');
    assert.ok(apiContent.includes('void'), 'JSON 추출 실패 시 void 타입이 생성되어야 함');

    console.log('✅ JSON 추출 실패 시 void 타입 생성 테스트 통과');
  });

  test('빈 배열 []인 경우 any[] 타입 생성', () => {
    const emptyArrayFixtureDir = join(FIXTURES_DIR, 'bruno-empty-array');
    mkdirSync(emptyArrayFixtureDir, { recursive: true });
    
    // 폴더 구조 생성
    const testFolder = join(emptyArrayFixtureDir, 'test');
    mkdirSync(testFolder, { recursive: true });

    const emptyArrayFile = join(testFolder, 'empty-array.bru');
    const emptyArrayContent = `meta {
  name: Empty Array Test
  type: http
}

get /test/empty-array

docs {
  \`\`\`json
  {
    "items": []
  }
  \`\`\`
}
`;
    require('fs').writeFileSync(emptyArrayFile, emptyArrayContent);

    const outputDir = join(TEST_OUTPUT_DIR, 'empty-array-output');
    execSync(`node dist/cli/index.js generate-hooks -i ${emptyArrayFixtureDir} -o ${outputDir}`, {
      cwd: join(__dirname, '..'),
    });

    // api.ts 파일 확인 (도메인은 폴더명 'test'가 됨)
    const apiFile = join(outputDir, 'test', 'api.ts');
    assert.ok(existsSync(apiFile), 'api.ts 파일이 생성되어야 함');

    const apiContent = readFileSync(apiFile, 'utf-8');
    assert.ok(apiContent.includes('any[]'), '빈 배열은 any[] 타입이어야 함');

    console.log('✅ 빈 배열 any[] 타입 생성 테스트 통과');
  });

  test('parsed.docs가 없는 경우 void 타입 생성', () => {
    const noDocsFixtureDir = join(FIXTURES_DIR, 'bruno-no-docs');
    mkdirSync(noDocsFixtureDir, { recursive: true });
    
    // 폴더 구조 생성
    const testFolder = join(noDocsFixtureDir, 'test');
    mkdirSync(testFolder, { recursive: true });

    const noDocsFile = join(testFolder, 'no-docs.bru');
    const noDocsContent = `meta {
  name: No Docs Test
  type: http
}

get /test/no-docs
`;
    require('fs').writeFileSync(noDocsFile, noDocsContent);

    const outputDir = join(TEST_OUTPUT_DIR, 'no-docs-output');
    execSync(`node dist/cli/index.js generate-hooks -i ${noDocsFixtureDir} -o ${outputDir}`, {
      cwd: join(__dirname, '..'),
    });

    // api.ts 파일 확인 (도메인은 폴더명 'test'가 됨)
    const apiFile = join(outputDir, 'test', 'api.ts');
    assert.ok(existsSync(apiFile), 'api.ts 파일이 생성되어야 함');

    const apiContent = readFileSync(apiFile, 'utf-8');
    assert.ok(apiContent.includes('void'), 'docs가 없으면 void 타입이 생성되어야 함');

    console.log('✅ docs 없을 때 void 타입 생성 테스트 통과');
  });
});

console.log('\n🎉 모든 테스트 완료!');
