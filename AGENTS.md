# AGENTS Knowledge Base

## Mandatory Rule

- PR 제목과 본문은 반드시 한국어로 작성한다.

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
- Keep commit messages aligned with repository conventions.
- Write commit messages and PR title/body in Korean by default.
- Run `pnpm typecheck` (and relevant app checks) before push.

## UI Guardrails (University Fallback)

- For university background image fallback UI, keep existing text color unchanged in surrounding UI.
- Do not render text inside fallback image assets.
- Use a fallback background that preserves readability for overlaid white text (e.g. dark neutral/gradient placeholder).

## Architecture References

- High-level architecture: `ARCHITECTURE.md`.
- Web app auth/details: `apps/web/AUTHENTICATION.md` (kept in sync verbatim with `apps/university-web/AUTHENTICATION.md` — edit both).
- Web component guidance: `apps/web/COMPONENTS.md` (kept in sync verbatim with `apps/university-web/COMPONENTS.md` — edit both).
- University multi-zone routing/deploy: `docs/university-multizone-deployment.md`.
- Team workflow: `docs/development-workflow.md` and `CLAUDE.md`.
- LLM repository context: `llms.txt`.

## Skills

- `.claude/skills/bruno-codegen-react-query` — Bruno sync, codegen, React Query wiring.
- `.claude/skills/biome-unification-ci` — keep Biome lint/typecheck commands identical across apps, Husky, and CI.
- `.claude/skills/commit-push-pr` — one-shot commit + push + PR creation, Korean-language output.
- `.claude/skills/university-web-rewrite-caution` — **read before any `apps/university-web` change**; the app is a separately deployed SSG Multi-Zone app under active layout rewrite, with route-ownership and duplicated-doc pitfalls.
- `.claude/skills/rebase-issues-405-409`, `.claude/skills/univ-extends-bruno-sync` — branch-specific rebase playbooks, relevant only while those branches are active.
