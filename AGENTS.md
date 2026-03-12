# AGENTS Knowledge Base

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
- `packages`: shared package workspace.
- `docs`: project docs and workflow references.

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
- Web app auth/details: `apps/web/AUTHENTICATION.md`.
- Web component guidance: `apps/web/COMPONENTS.md`.
- Team workflow: `docs/development-workflow.md` and `CLAUDE.md`.
