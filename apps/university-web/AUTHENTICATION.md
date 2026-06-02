# Authentication & Authorization

## Overview

웹 인증은 **클라이언트 재발급/인터셉터 중심**으로 동작합니다.

- 서버 진입 시 middleware에서 보호 경로를 `/login`으로 선리다이렉트하지 않습니다.
- 인증 실패 시점은 페이지 렌더/데이터 요청 단계에서 결정됩니다.

## Current Flow

### 1. App Initialization

- `ReissueProvider`에서 앱 최초 진입 시 `/auth/reissue`를 시도합니다.
- 성공 시 access token이 스토어에 반영되고, 실패 시 비로그인 상태를 유지합니다.

### 2. Request Interceptor

- `axiosInstance` 요청 인터셉터가 access token 만료 여부를 검사합니다.
- 토큰이 없거나 만료된 경우 재발급을 시도하고, 실패하면 로그인 이동을 유도합니다.

### 3. Response Interceptor

- API 응답이 401이면 재발급 1회 후 원요청을 재시도합니다.
- 재시도 실패 시 로그인 페이지로 이동합니다.

### 4. Page-level Guards

- 인증이 필요한 UI(예: 멘토 페이지)는 클라이언트에서 재발급/토큰 상태를 확인합니다.
- 필요한 경우 페이지 내부 로직에서 `/login`으로 이동합니다.

## Middleware Responsibility

`apps/web/src/middleware.ts`는 현재 아래만 담당합니다.

- stage 환경 `robots.txt` 제어
- 스캐너/프로브 경로 차단 (`.php`, `/.git`, `/wp-admin` 등)
- 정적 리소스 경로 제외 matcher 유지

즉, middleware는 더 이상 인증 선검증(보호 경로 강제 로그인 리다이렉트)을 수행하지 않습니다.

## Tokens

### Refresh Token

- HTTP-only 쿠키로 관리
- 재발급 API 호출 시 서버가 검증

### Access Token

- Zustand store 기반으로 관리
- API 인증 헤더에 사용
- 만료 시 재발급을 통해 갱신

## Related Files

- `apps/web/src/lib/zustand/useAuthStore.ts`
- `apps/web/src/utils/axiosInstance.ts`
- `apps/web/src/components/layout/ReissueProvider/index.tsx`
- `apps/web/src/middleware.ts`
