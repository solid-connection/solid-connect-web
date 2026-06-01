# Vinext Migration Report

## 변경 요약

- `apps/admin`의 TanStack Start 라우팅 구조를 Vinext 호환 App Router 구조로 변경했다.
- `src/routes` 기반 라우트를 `src/app`으로 이동하고, 라우트 파일에 있던 UI는 feature 컴포넌트로 분리했다.
- TanStack Router navigation 의존을 일반 anchor 및 브라우저 이동 흐름으로 교체했다.
- Vinext `dev`, `build`, `start`/`preview` script를 적용하고 Vite 설정을 Vinext/Nitro Vercel output 중심으로 정리했다.
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

## SSR 상태

- Vinext build는 RSC, client, SSR environment를 모두 생성하며, `.vercel/output/functions/__server.func/index.mjs`를 통해 각 route의 HTML shell을 서버에서 응답한다.
- 현재 admin 인증은 localStorage의 access token을 기준으로 동작한다. 따라서 `/scores`, `/mentor-applications`, `/regions-countries` 같은 보호 페이지의 실제 테이블 데이터 요청은 서버가 아니라 브라우저에서 세션 확인 후 TanStack Query로 실행된다.
- 즉, 현재 상태는 **route shell SSR + client-side authenticated data fetching**이다. 서버 HTML 응답 단계에서 사용자별 보호 데이터를 미리 채워 넣는 full data SSR은 아직 적용하지 않는다.
- full data SSR을 적용하려면 admin access token 또는 session을 서버가 읽을 수 있는 httpOnly cookie 기반으로 전환하고, server-side API client, React Query dehydration, logout cookie clear 흐름을 함께 설계해야 한다.
- localStorage 인증을 유지한 상태에서 서버가 보호 API를 호출하도록 우회하면 토큰 중복 저장 또는 보안 모델 혼선이 생기므로, 이 변경은 별도 인증 아키텍처 PR로 분리한다.

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
- `/`, `/auth/login`, `/scores` 등 API 클라이언트를 import하는 라우트도 `VITE_API_SERVER_URL` 누락만으로 SSR import 단계에서 500이 나지 않아야 한다. 실제 API 호출 시점에는 명확한 환경변수 오류로 실패한다.
- `vinext build`는 Nitro Vercel preset 기준 `.vercel/output`을 생성하므로, 로컬 production preview는 `vinext start`가 아니라 `.vercel/output/functions/__server.func/index.mjs`를 `srvx`로 실행한다.
- Vercel Project Settings에서 Root Directory를 `apps/admin`으로 잡는 경우 output directory는 비워두고, Build Command는 `pnpm build`를 사용한다. `.vercel/output`은 Vercel Build Output API 경로라서 별도 Output Directory로 지정하지 않는다.

## 검증 결과

- dev: `VITE_API_SERVER_URL=https://api.example.com VITE_S3_BASE_URL=https://s3.example.com pnpm --filter @solid-connect/admin dev` 성공
- build: `pnpm --filter @solid-connect/admin build` 성공
- preview/start: `pnpm --filter @solid-connect/admin start`로 `.vercel/output` SSR preview 성공
- lint: `pnpm --filter @solid-connect/admin lint:check` 성공
- typecheck: `pnpm --filter @solid-connect/admin typecheck` 성공
- test: `pnpm --filter @solid-connect/admin test` 성공
- compatibility: `pnpm --filter @solid-connect/admin exec vinext check` 93% compatible
  - partial: `next/font/google` 항목은 Vinext가 CDN font 로딩으로 분류한다. 현재 admin source에서 직접 사용 중인 `next/font/google` import는 없다.
- 주요 페이지 수동 QA: `/`, `/login`, `/auth/login`, `/scores`, `/bruno`, `/chat-socket`, `/regions-countries`, `/mentor-applications` 모두 HTTP 200 확인
