# React Compiler rollout

## Current setup

- React Compiler is wired through `experimental.reactCompiler` in `next.config.mjs`.
- The web app runs on Next.js 15 because the compiler config is handled by Next, not a custom Babel pipeline.
- React is still 18, so `react-compiler-runtime` is a runtime dependency and the compiler target is `"18"`.
- The current lockfile resolves React and React DOM to `18.3.1`. The `^18` range does not admit React 19, so React 19 should remain a separate migration.
- The compiler runs in `compilationMode: "annotation"` so only components or hooks with `"use memo"` are compiled.
- `ChannelBadge` is the first annotated component. It is intentionally small and presentational to keep the first rollout low risk.

## Rollout notes

- A custom Babel config is intentionally not used because it disables SWC and conflicts with `next/font` in this Next.js app.
- Keep `babel-plugin-react-compiler` and `react-compiler-runtime` on the same version when upgrading either package.
- This branch keeps the existing `next dev` script. If the web app later switches dev mode to Turbopack, re-run the compiler-output check there before widening annotation coverage.
- Build time should be watched before widening compiler coverage.
- Do not switch to full compilation until the app has a React Compiler lint/audit path. The current repo uses Biome instead of ESLint, so `eslint-plugin-react-hooks` `recommended-latest` is a follow-up decision rather than part of this first slice.
- For any component that behaves incorrectly after annotation, remove `"use memo"` or add `"use no memo"` while investigating.
- Current Next/Sentry warnings are unrelated to the compiler rollout, but should be reviewed before broadly modernizing the web app runtime.

## Next.js 15 compatibility audit

The Next.js 15 migration removed `next/dynamic(..., { ssr: false })` from Server Components because that option is no longer accepted there. Each direct import was audited before keeping the change:

| Import target | Boundary / SSR safety |
| --- | --- |
| `AppleScriptLoader` | `"use client"` and renders `next/script` only. |
| `KakaoScriptLoader` | `"use client"` with `typeof window !== "undefined"` before Kakao initialization. |
| `LoginContent` | `"use client"`. |
| `NewsSection` | `"use client"`; `window.IntersectionObserver` is used inside `useEffect`. |
| `ApplyPageContent` | `"use client"`. |
| `ScoreScreen` | `"use client"`. |
| `SearchClientContent` | `"use client"`. |
| `AIInspectorFab` | `"use client"`; `window.location.href` is read inside a click handler. |
| `ClientModal` | `"use client"`. |
| `PopularUniversityCard` | No browser-only API usage; safe as a server-renderable component. |

## Verification

- Run `pnpm --filter @solid-connect/web build` and confirm the compiled server/client output references `react-compiler-runtime`.
- Run `pnpm --filter @solid-connect/web ci:check` before merging.
