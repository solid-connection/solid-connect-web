# AGENTS Knowledge Base

이 문서는 Codex, Claude Code 등 이 저장소에서 작업하는 모든 코딩 에이전트가 공통으로 읽는 단일 소스입니다.
저장소 규칙/개요를 바꿀 때는 이 파일만 수정하세요 (`CLAUDE.md`는 이 파일을 그대로 불러오는 얇은 파일이라 별도로 복제하지 않습니다).

## Mandatory Rule

- 커밋 메시지와 PR 제목/본문은 반드시 한국어로 작성한다.

## Project Overview

- Monorepo managed with `pnpm` + `turbo`.
- Main apps live in `apps/web` (Next.js) and `apps/admin`.
- Root scripts are orchestrated via Turbo:
  - `pnpm dev`
  - `pnpm build`
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm ci:check`

## Structure

- `apps/web`: user-facing web app (App Router based).
- `apps/admin`: admin web app.
- `apps/university-web`: university catalog app, deployed as a separate Next.js Multi-Zone project (SSG). **Currently mid-rewrite** — read the `university-web-rewrite-caution` skill before touching it.
- `packages`: shared package workspace.
- `docs`: project docs and workflow references.
- `.claude/skills`: task-specific skills (Bruno codegen, Biome CI unification, commit/push/PR flow, university-web caution, branch-specific rebase playbooks).

## Working Rules

- Use `pnpm` as the package manager.
- Use Node.js `22.x` (see root `package.json`).
- Follow existing code style and architecture docs before changing behavior.
- Prefer small, focused changes and preserve current patterns.

## Git / Workflow Notes

- Branch from `main` for new work.
- Always start every new task from a fresh branch created from `main`, and name the branch to match the task scope (for example: `fix/university-fallback-image-contrast`).
- Keep commit messages aligned with the Commit Message Convention below.
- Write commit messages and PR title/body in Korean by default.
- Run `pnpm typecheck` (and relevant app checks) before push.

## Commit Message Convention

1. **깃 이모지 사용**: 커밋 타입을 나타내는 이모지를 맨 앞에 사용한다.
2. **원자적 커밋**: 하나의 커밋은 하나의 논리적 변경사항만 포함한다.
3. **간결하게 한 줄로**: 커밋 메시지는 한 줄로 간결하게 작성한다.

| 이모지 | 코드                          | 설명                     |
| ------ | ----------------------------- | ------------------------ |
| ✨     | `:sparkles:`                  | 새로운 기능 추가         |
| 🐛     | `:bug:`                       | 버그 수정                |
| 🔧     | `:wrench:`                    | 설정 파일 수정           |
| 📝     | `:memo:`                      | 문서 추가/수정           |
| 💄     | `:lipstick:`                  | UI/스타일 파일 추가/수정 |
| ♻️     | `:recycle:`                   | 코드 리팩토링            |
| 🔥     | `:fire:`                      | 코드/파일 삭제           |
| 🚀     | `:rocket:`                    | 배포/성능 개선           |
| ✅     | `:white_check_mark:`          | 테스트 추가/수정         |
| 🔒     | `:lock:`                      | 보안 이슈 수정           |
| ⬆️     | `:arrow_up:`                  | 의존성 업그레이드        |
| ⬇️     | `:arrow_down:`                | 의존성 다운그레이드      |
| 🎨     | `:art:`                       | 코드 구조/포맷 개선      |
| 🚧     | `:construction:`              | 작업 진행 중             |
| 💚     | `:green_heart:`               | CI 빌드 수정             |
| 📦     | `:package:`                   | 패키지 또는 빌드 관련    |
| 🔀     | `:twisted_rightwards_arrows:` | 브랜치 병합              |

```bash
# 좋은 예
git commit -m "✨ 사용자 인증 기능 추가"
git commit -m "🐛 로그인 버튼 클릭 오류 수정"
git commit -m "🔥 불필요한 레거시 파일 삭제"
git commit -m "📝 README 설치 가이드 추가"
git commit -m "♻️ API 호출 로직 리팩토링"

# 나쁜 예 (여러 변경사항을 한 커밋에)
git commit -m "기능 추가 및 버그 수정 및 문서 업데이트"

# 나쁜 예 (설명이 너무 김)
git commit -m "사용자 인증 기능을 추가했습니다. 이 기능은 JWT를 사용하며..."
```

하나의 커밋은 다음 중 하나만 포함해야 한다: 기능 추가 1건, 버그 수정 1건, 리팩토링 1건, 관련된 설정 변경 1건. 여러 작업을 했다면 각각 별도의 커밋으로 분리한다.

## UI Guardrails (University Fallback)

- For university background image fallback UI, keep existing text color unchanged in surrounding UI.
- Do not render text inside fallback image assets.
- Use a fallback background that preserves readability for overlaid white text (e.g. dark neutral/gradient placeholder).

## Architecture References

- High-level architecture: `ARCHITECTURE.md`.
- Web app auth/details: `apps/web/AUTHENTICATION.md` (kept in sync verbatim with `apps/university-web/AUTHENTICATION.md` — edit both).
- Web component guidance: `apps/web/COMPONENTS.md` (kept in sync verbatim with `apps/university-web/COMPONENTS.md` — edit both).
- University multi-zone routing/deploy: `docs/university-multizone-deployment.md`.
- Team workflow: `docs/development-workflow.md`.
- LLM repository context: `llms.txt`.

## Skills

Task-specific runbooks live under `.claude/skills/<name>/SKILL.md`. They are plain Markdown and work with any coding agent — open the file directly by path when its topic matches your task:

- Claude Code auto-discovers and can invoke these via its Skill tool (the YAML frontmatter at the top of each file is Claude Code's discovery metadata; ignore it if your tool doesn't use it and just read the Markdown body below it).
- Codex and other agents have no auto-discovery for this folder — read the relevant `SKILL.md` path directly (listed below) when the task matches, the same way you would read any other doc referenced from this file.

| Skill path | Use when |
|---|---|
| `.claude/skills/bruno-codegen-react-query/SKILL.md` | Syncing Bruno API specs, regenerating the shared TypeScript client, or wiring React Query on top of it. |
| `.claude/skills/biome-unification-ci/SKILL.md` | Adding/checking lint, typecheck, or CI scripts so web/admin/university-web/Husky/CI stay identical. |
| `.claude/skills/commit-push-pr/SKILL.md` | Doing commit + push + PR creation in one pass, Korean-language output. |
| `.claude/skills/university-web-rewrite-caution/SKILL.md` | **Any change touching `apps/university-web`.** It's a separately deployed SSG Multi-Zone app under an active layout rewrite, with route-ownership and duplicated-doc pitfalls — read this first. |
| `.claude/skills/rebase-issues-405-409/SKILL.md` | Rebasing the `fix/issues-405-409` branch specifically. |
| `.claude/skills/univ-extends-bruno-sync/SKILL.md` | Rebasing the `feat/univ-extends` branch and re-syncing Bruno specs. |
