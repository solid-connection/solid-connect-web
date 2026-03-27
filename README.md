# 솔리드 커넥션 웹

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Clsx
- Axios
- Biome (Linter & Formatter)
- Vercel

## Prerequisites

- Node.js 22.x
- pnpm 9.x or later

## Installation

This project uses pnpm as the package manager.

```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install
```

## Commands

```bash
# Development server
pnpm run dev

# Build for production
pnpm run build

# Lint and auto-fix
pnpm run lint

# Lint check only (no fix)
pnpm run lint:check

# Format code
pnpm run format

# Format check only (no write)
pnpm run format:check

# Type checking
pnpm run typecheck

# Run all checks (CI)
pnpm run ci:check

# Fix all (lint + format)
pnpm run fix:all
```

## Migration from npm

If you have an existing clone:

```bash
rm -rf node_modules package-lock.json
pnpm install
```

## AI Inspector Workflow

Admin 계정일 때 좌측 하단에 AI 인스펙터 플로팅 버튼이 노출됩니다.

1. 인스펙터 버튼 클릭 후 요소 선택
2. 자연어 수정 요청 입력
3. `POST /api/ai-inspector-requests` 호출 (클라이언트는 Firebase 직접 접근하지 않음)
4. API 서버가 관리자 권한을 검증하고 Firestore에 `queued` 상태로 저장
5. 로컬 워커(`pnpm ai-inspector:worker` 또는 `pnpm ai-inspector:worker:loop`)가 `queued -> processing`으로 작업 클레임 후 처리
6. 작업 결과를 `completed` 또는 `failed`로 업데이트하고 PR/프리뷰 링크를 Discord webhook으로 전송

### Shared package

인스펙터 핵심 로직은 공용 패키지 [`packages/ai-inspector`](./packages/ai-inspector)로 분리되어 있습니다.

- DOM 선택/selector 계산 및 hover rect 생성
- 인스펙트 상태 관리 hook (`useAiInspectorSelection`)
- 요청 전송 API helper (`createAiInspectorRequest`)
- 공용 타입(`ElementSelection`, request payload/response)

웹/어드민 모두 동일 패키지를 import해서 확장할 수 있습니다.

### Web env (server)

`apps/web` 서버 런타임에 아래 환경변수가 필요합니다.

- `NEXT_PUBLIC_API_SERVER_URL` (토큰 검증용 `/my` 호출)
- `AI_INSPECTOR_FIREBASE_PROJECT_ID`
- `AI_INSPECTOR_FIREBASE_CLIENT_EMAIL`
- `AI_INSPECTOR_FIREBASE_PRIVATE_KEY`
- `AI_INSPECTOR_FIRESTORE_COLLECTION` (optional, default: `aiInspectorTasks`)

등록 위치:
- 로컬 개발: `apps/web/.env.local`
- Vercel 배포: Vercel Project > Settings > Environment Variables (Preview/Production 둘 다)

### Local worker env

로컬 워커는 아래 환경변수를 사용합니다.

- `AI_INSPECTOR_FIREBASE_PROJECT_ID`
- `AI_INSPECTOR_FIREBASE_CLIENT_EMAIL`
- `AI_INSPECTOR_FIREBASE_PRIVATE_KEY`
- `AI_INSPECTOR_FIRESTORE_COLLECTION` (optional, default: `aiInspectorTasks`)
- `AI_INSPECTOR_BASE_BRANCH` (optional, default: `main`)
- `GITHUB_TOKEN` or `GH_TOKEN` (required for PR 생성)
- `GITHUB_REPOSITORY` (optional, 미지정 시 `git remote origin`에서 자동 추론)
- `AI_INSPECTOR_PATCH_ENDPOINT` (optional: external AI patch 생성 endpoint)
- `AI_INSPECTOR_PATCH_API_KEY` (optional)
- `AI_INSPECTOR_LOCAL_CODEX_ENABLED` (optional, default: `true`)
- `AI_INSPECTOR_CODEX_MODEL` (optional, local codex 모델 고정)
- `AI_INSPECTOR_PREVIEW_URL_TEMPLATE` (optional, example: `https://your-app-git-{branch}.vercel.app`)
- `VERCEL_TOKEN` (optional, 설정 시 실제 Vercel deployment URL 조회)
- `VERCEL_PROJECT_ID` (optional, `VERCEL_TOKEN`과 함께 필요)
- `VERCEL_TEAM_ID` (optional)
- `AI_INSPECTOR_VERCEL_PREVIEW_TIMEOUT_MS` (optional, default: `240000`)
- `AI_INSPECTOR_VERCEL_PREVIEW_INTERVAL_MS` (optional, default: `10000`)
- `AI_INSPECTOR_DISCORD_WEBHOOK_URL` (optional)
- `AI_INSPECTOR_POLL_INTERVAL_SECONDS` (optional, loop 실행시 기본 900초)

등록 위치:
- 로컬 개발: `apps/web/.env.local`

참고:
- `AI_INSPECTOR_PATCH_ENDPOINT`가 없으면 로컬 `codex exec`로 실제 코드 수정을 시도합니다.
- task 메타 파일만 변경되고 실제 코드 변경이 없으면 워커는 실패 처리합니다.
- 워커 실행 전 git working tree가 clean 상태여야 합니다.
- `VERCEL_TOKEN`/`VERCEL_PROJECT_ID`가 있으면 Vercel API로 실제 Preview URL을 조회합니다.
- 위 값이 없어도 GitHub commit status의 Vercel `target_url`을 폴링해 Preview URL을 찾습니다.

실행:

```bash
# 단발 실행 (큐에서 1건 클레임 후 종료)
pnpm ai-inspector:worker

# 반복 실행 (기본 15분 주기)
pnpm ai-inspector:worker:loop
```
