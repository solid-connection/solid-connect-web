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
3. Firebase `aiInspectorTasks` 컬렉션에 `pending`으로 저장
4. GitHub Actions 크론(`.github/workflows/ai-inspector-worker.yml`)이 주기적으로 작업 처리
5. 작업 결과 PR/프리뷰 링크를 Discord webhook으로 전송

### Web env (client)

`apps/web` 런타임에 아래 환경변수가 필요합니다.

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_AI_INSPECTOR_COLLECTION` (optional, default: `aiInspectorTasks`)

### GitHub secrets (worker)

`.github/workflows/ai-inspector-worker.yml`에서 사용합니다.

- `AI_INSPECTOR_FIREBASE_PROJECT_ID`
- `AI_INSPECTOR_FIREBASE_CLIENT_EMAIL`
- `AI_INSPECTOR_FIREBASE_PRIVATE_KEY`
- `AI_INSPECTOR_PATCH_ENDPOINT` (optional: AI patch 생성 endpoint)
- `AI_INSPECTOR_PATCH_API_KEY` (optional)
- `AI_INSPECTOR_PREVIEW_URL_TEMPLATE` (optional, example: `https://your-app-git-{branch}.vercel.app`)
- `AI_INSPECTOR_DISCORD_WEBHOOK_URL` (optional)
