# Vinext Migration Report

## 변경 요약

- `apps/admin`의 TanStack Start 라우팅 구조를 Vinext 호환 App Router 구조로 변경했다.
- `src/routes` 기반 라우트를 `src/app`으로 이동하고, 라우트 파일에 있던 UI는 feature 컴포넌트로 분리했다.
- TanStack Router navigation 의존을 일반 anchor 및 브라우저 이동 흐름으로 교체했다.
- Vinext `dev`, `build`, `start` script를 적용하고 Vite 설정을 Vinext 플러그인 중심으로 정리했다.
- TanStack Start, TanStack Router, route tree, Nitro 기반 진입점을 제거했다.

## 라우트 매핑

| Before | After |
| --- | --- |
| `src/routes/__root.tsx` | `src/app/layout.tsx`, `src/app/providers.tsx` |
| `src/routes/index.tsx` | `src/app/page.tsx` |
| `src/routes/login.tsx` | `src/app/login/page.tsx` |
| `src/routes/auth/login.tsx` | `src/app/auth/login/page.tsx`, `src/components/features/auth/AdminLoginPage.tsx` |
| `src/routes/scores/index.tsx` | `src/app/scores/page.tsx`, `src/components/features/scores/ScoresPageContent.tsx` |
| `src/routes/bruno/index.tsx` | `src/app/bruno/page.tsx`, `src/components/features/bruno/BrunoApiPageContent.tsx` |
| `src/routes/chat-socket/index.tsx` | `src/app/chat-socket/page.tsx`, `src/components/features/chat-socket/ChatSocketPageContent.tsx` |

## 유지한 것

- 기존 UI 컴포넌트와 admin 페이지 화면 구성
- `components/features`, `components/layout`, `lib`, `types` 중심의 기존 코드 배치
- TanStack Query 기반 서버 상태 관리
- localStorage 기반 admin session 저장소
- login, scores, bruno, chat-socket 사용자 플로우

## 제거한 것

- `RouterProvider`
- `src/routeTree.gen.ts`
- `src/router.tsx`
- `src/routes/**`
- `createFileRoute`, `createRootRoute`
- TanStack Start Vite plugin, Nitro entry
- `@tanstack/react-router`, `@tanstack/react-start`, TanStack Router Devtools 의존성

## 주의할 점

- Vinext는 Next.js 호환 API를 Vite 기반으로 재구현한 도구이므로, Next.js와 완전히 동일한 내부 동작을 전제하지 않는다.
- Vinext build 결과에서 route classification이 `Unknown`으로 표시된다. 현재 Vinext의 정적 분석 한계 안내이며 빌드는 성공한다.
- 현재 로컬 Node가 `v23.10.0`이라 repo 요구사항 `22.x` 경고가 출력된다.
- `@tailwindcss/vite`는 현재 Vite 8 peer range를 공식 포함하지 않아 peer warning이 출력된다. 빌드와 라우트 QA는 통과했다.
- `/`, `/auth/login`, `/scores` 등 API 클라이언트를 import하는 라우트는 `VITE_API_SERVER_URL`이 없으면 기존 로직에 의해 500이 난다. QA는 `.env.example` 기준 예시 값을 주입해 진행했다.

## 검증 결과

- dev: `VITE_API_SERVER_URL=https://api.example.com VITE_S3_BASE_URL=https://s3.example.com pnpm --filter @solid-connect/admin dev` 성공
- build: `pnpm --filter @solid-connect/admin build` 성공
- lint: `pnpm --filter @solid-connect/admin lint:check` 성공
- typecheck: `pnpm --filter @solid-connect/admin typecheck` 성공
- compatibility: `pnpm --filter @solid-connect/admin exec vinext check` 100% compatible
- 주요 페이지 수동 QA: `/`, `/login`, `/auth/login`, `/scores`, `/bruno`, `/chat-socket` 모두 HTTP 200 확인
