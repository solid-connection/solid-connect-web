# University Multi-Zone Deployment

## 목표

대학 정보 catalog 페이지는 `apps/university-web`에서 SSG로 정적 생성하고, 메인 웹 `apps/web`은 인증/수정 플로우인 `/university/score`, `/university/application`만 유지한다.

이 구조의 목적은 다음과 같다.

- 메인 앱 변경 시 대학 catalog 정적 페이지 전체를 다시 빌드하지 않는다.
- 대학 정보 버그나 데이터 갱신은 university zone만 재배포해서 처리한다.
- 대학 데이터는 수동으로 DB 갱신 후 university zone을 다시 빌드한다.

## 라우트 소유권

### `apps/web`

- `/`
- `/community/*`
- `/mentor/*`
- `/my/*`
- `/university/score/*`
- `/university/application/*`

### `apps/university-web`

- `/university`
- `/university/search`
- `/university/:homeUniversity`
- `/university/:homeUniversity/search`
- `/university/:homeUniversity/:id`
- `/university-static/*`

`/university/list/:homeUniversity`는 legacy URL로만 취급한다. child route는 유지하지 않고, main rewrite에서 `/university/:homeUniversity` SSG 페이지로 보낸다. 이렇게 하면 오래된 외부 링크는 살리면서 SSG catalog 안에 client-fetch 목록 페이지가 섞이지 않는다.

## Vercel 프로젝트 설정

Vercel에서는 같은 Git repository를 두 개의 Project로 연결한다.

### Main Web Project

- Project name: 기존 `solid-connect-web` 유지
- Root Directory: 기존 `apps/web` 설정 유지
- Build Command: 기존 설정 유지. monorepo root에서 실행한다면 `pnpm --filter @solid-connect/web run build`
- Required Environment Variables:
  - `UNIVERSITY_WEB_DOMAIN`: university web project의 origin URL
  - production 예: `https://<university-web-production-domain>`
  - preview 예: `https://<university-web-preview-domain>` 또는 preview에서 production university zone을 재사용할 경우 production URL

`UNIVERSITY_WEB_DOMAIN`이 production build에서 없으면 `apps/web/next.config.mjs`가 빌드를 실패시킨다. 이 값이 없으면 main 앱의 `/university` catalog route가 404가 되기 때문이다.

### University Web Project

- Project name: 예: `solid-connect-university-web`
- Root Directory: `apps/university-web`
- Build Command: Vercel이 workspace를 자동 감지하지 못하면 `pnpm --filter @solid-connect/university-web run build`
- Development Command: `pnpm --filter @solid-connect/university-web run dev`
- Output Directory: `.next`
- Required Environment Variables:
  - 기존 web 앱과 동일한 `NEXT_PUBLIC_API_SERVER_URL`
  - 기존 web 앱과 동일한 `NEXT_PUBLIC_WEB_URL`
  - 기존 web 앱과 동일한 Kakao/Firebase 계열 값
  - 선택: `UNIVERSITY_WEB_INDEXABLE_HOSTS=www.solid-connection.com,solid-connection.com`

University project의 직접 배포 도메인은 검색엔진에 노출하지 않는다. 실제 사용자 URL은 main domain의 rewrite를 통해 제공한다.

## Release 배포

production 릴리즈는 GitHub Actions `Promote Main to Release Branches` workflow로 release branch를 갱신해 Vercel 배포를 트리거한다.

- Main Web Project production branch: `release-web`
- Admin Project production branch: `release-admin`
- University Web Project production branch: `release-university`

workflow target은 다음과 같이 사용한다.

- `all`: `release-web`, `release-admin`, `release-university`를 모두 main으로 갱신
- `university`: `release-university`만 main으로 갱신
- `both`: 기존 호환용으로 `release-web`, `release-admin`만 갱신

workflow 기본값은 `both`다. university web production 배포는 `all` 또는 `university`를 명시적으로 선택했을 때만 함께 승격한다.

production web project의 `UNIVERSITY_WEB_DOMAIN`은 university web production origin을 가리켜야 한다. 예를 들어 사용자 production URL이 `https://www.solid-connection.com/university`라면 rewrite 대상은 별도 university web production origin이다.

```bash
UNIVERSITY_WEB_DOMAIN=https://<university-web-production-origin>
```

production university web project의 `NEXT_PUBLIC_WEB_URL`은 실제 사용자가 접근하는 main web production URL을 가리킨다.

```bash
NEXT_PUBLIC_WEB_URL=https://www.solid-connection.com
```

## Local Development

터미널 두 개에서 실행한다.

```bash
pnpm dev:web
pnpm dev:university
```

`apps/web/.env.development`에는 `UNIVERSITY_WEB_DOMAIN=http://localhost:3001`을 둔다. 따라서 `http://localhost:3000/university` 요청은 university zone으로 rewrite된다.

## Verification

### 빠른 검증

```bash
pnpm --filter @solid-connect/web run lint:check
pnpm --filter @solid-connect/university-web run lint:check
pnpm --filter @solid-connect/web run typecheck
pnpm --filter @solid-connect/university-web run typecheck
```

### Cold Build 비교

```bash
rm -rf apps/web/.next
UNIVERSITY_WEB_DOMAIN=https://<university-web-origin> pnpm --filter @solid-connect/web run build

rm -rf apps/university-web/.next
pnpm --filter @solid-connect/university-web run build
```

기대 결과:

- main web build route 목록에는 `/university/score/*`, `/university/application/*`만 남는다.
- university web build route 목록에는 `/university`, `/university/:homeUniversity`, `/university/:homeUniversity/:id`가 SSG로 표시된다.
- university web의 SSG 데이터 fetch가 실패하면 빈 catalog를 만들지 않고 build가 실패한다.

## 참고 문서

- Next.js Multi-Zones: https://nextjs.org/docs/pages/guides/multi-zones
- Vercel Monorepos: https://vercel.com/docs/monorepos
