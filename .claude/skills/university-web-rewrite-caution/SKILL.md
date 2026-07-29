---
name: university-web-rewrite-caution
description: Safety checklist before touching apps/university-web — it is a separately deployed Next.js Multi-Zone SSG app that is CURRENTLY MID-REWRITE (desktop "skyscanner-style" layout redesign) with parallel work happening in git worktrees. Use whenever a task touches apps/university-web, the /university/* routes, packages/ui shared layout primitives, or anything under docs/screenshots/*-poc.
---

# University Web: 리라이트 중 주의사항

## 왜 이 스킬이 필요한가

`apps/university-web`은 단순한 하위 라우트가 아니라 **별도로 배포되는 독립 Next.js 앱**이고, 지금 **데스크톱 레이아웃 전면 리라이트("skyscanner-layout" 스타일)가 진행 중**이다. 다른 앱(`apps/web`, `apps/admin`)과 같은 감각으로 수정하면 다음이 쉽게 깨진다:

- 이미 진행 중인 리라이트 작업과 충돌하는 중복/역행 수정
- SSG 빌드 실패(빈 카탈로그로 조용히 넘어가지 않고 빌드 자체가 실패하도록 설계됨)
- `apps/web` ↔ `apps/university-web` 간 라우트 소유권 경계 위반
- `apps/web`과 `apps/university-web`에 **동일 내용으로 중복 보관된** `AUTHENTICATION.md`/`COMPONENTS.md` 드리프트

## 작업 전 체크리스트 (순서대로)

1. **진행 중인 리라이트와 충돌하는지 먼저 확인한다.**
   ```bash
   git worktree list
   git branch -a --list "*skyscanner*" "*university*"
   ```
   university 관련 worktree/브랜치가 이미 떠 있다면(예: `feat/skyscanner-layout-poc`, `fix/university-*`), 같은 화면을 건드리기 전에 해당 브랜치의 최신 diff를 확인해 중복 작업을 피한다.

2. **`docs/screenshots/`에 이미 있는 POC 자료를 확인한다.**
   - `docs/screenshots/skyscanner-layout-poc/`, `docs/screenshots/university-skyscanner-layout-poc/`에 데스크톱(1440x1000)/모바일(390x844) contact sheet가 있다.
   - 이미 리뷰된 레이아웃 결정(예: 대학 목록 가상화, 모바일 하단 네비 유지, 데스크톱 nav 숨김)을 임의로 되돌리지 않는다.

3. **라우트 소유권을 `docs/university-multizone-deployment.md` 기준으로 지킨다.**
   - `/university`, `/university/search`, `/university/:homeUniversity`, `/university/:homeUniversity/:id`, `/university-static/*` → `apps/university-web` 소유 (SSG)
   - `/university/score/*`, `/university/application/*` → `apps/web` 소유 (인증/수정 플로우, 여기는 그대로 둔다)
   - `/university/list/:homeUniversity`는 legacy URL이며 child route를 새로 만들지 않는다. redirect만 유지.
   - 카탈로그 성격의 새 university 라우트를 실수로 `apps/web`에 추가하지 않는다.

4. **공유 문서 동기화: `AUTHENTICATION.md` / `COMPONENTS.md`**
   - `apps/web/AUTHENTICATION.md` ≡ `apps/university-web/AUTHENTICATION.md`
   - `apps/web/COMPONENTS.md` ≡ `apps/university-web/COMPONENTS.md`
   - 둘은 현재 완전히 동일한 내용이다. 한쪽만 고치면 drift가 생기므로, 컨벤션을 바꿀 때는 **두 파일을 함께 수정**한다(diff로 확인: `diff apps/web/COMPONENTS.md apps/university-web/COMPONENTS.md`).

5. **레이아웃 공통화는 `packages/ui`로.**
   - 리라이트 과정에서 공통 레이아웃 프리미티브가 `packages/ui`로 추출되고 있다 (예: `packages/ui/src/mobile-hero-detail-shell.tsx`).
   - university 전용 화면이라도 web/admin과 겹치는 레이아웃 패턴이면 `apps/university-web` 내부에 새로 만들지 말고 `packages/ui`에 있는지 먼저 확인하고, 없으면 그쪽에 추가하는 것을 우선 고려한다.

6. **SSG 데이터 페칭은 실패를 삼키지 않는다.**
   - university-web의 카탈로그 SSG는 "데이터 fetch 실패 시 빈 카탈로그로 조용히 빌드 성공" 대신 **빌드 자체가 실패**하도록 되어 있다. 이 특성을 유지한다 (에러를 try/catch로 삼켜 빈 배열 fallback을 만들지 않는다).
   - 데이터 갱신은 수동 DB 갱신 후 university zone 재배포로 처리한다(`/university/revalidate` 참고).

7. **환경변수 의존성 확인.**
   - `apps/web`은 빌드 시 `UNIVERSITY_WEB_DOMAIN`이 없으면 실패하도록 되어 있다(`/university` rewrite 대상이 없으면 catalog가 404가 되기 때문). 이 가드를 우회/삭제하지 않는다.

## 검증

```bash
pnpm --filter @solid-connect/university-web run lint:check
pnpm --filter @solid-connect/university-web run typecheck:ci
pnpm --filter @solid-connect/university-web run build
pnpm --filter @solid-connect/web run build   # UNIVERSITY_WEB_DOMAIN 필요
```

레이아웃을 변경했다면, 기존 POC와 같은 방식으로 데스크톱 1440x1000 / 모바일 390x844 스크린샷을 `docs/screenshots/<작업명>/`에 남기고 PR에 첨부하는 것을 권장한다 (기존 사례: `docs/screenshots/university-skyscanner-layout-poc/README.md`).

## 참고 문서

- `docs/university-multizone-deployment.md` — 라우트 소유권, Vercel 프로젝트 분리, 배포 절차
- `docs/screenshots/university-skyscanner-layout-poc/` — 진행 중인 리라이트의 최신 시각 QA 기준
- `.claude/skills/bruno-codegen-react-query/SKILL.md` — university-web도 같은 Bruno codegen을 공유하므로 API 변경 시 함께 참고
