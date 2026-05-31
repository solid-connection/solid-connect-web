# React Compiler rollout

## Current setup

- React Compiler is wired through top-level `reactCompiler` in `next.config.mjs`.
- The web app runs on React 19 and Next.js 16, so compiled output can use React's built-in compiler runtime.
- `react-compiler-runtime` is not installed because it is only needed when targeting React 17 or 18.
- The compiler runs in `compilationMode: "annotation"` so only components or hooks with `"use memo"` are compiled.
- `ChannelBadge` is the first annotated component. It is intentionally small and presentational to keep the first rollout low risk.

## Rollout notes

- A custom Babel config is intentionally not used because it disables SWC and conflicts with `next/font` in this Next.js app.
- Keep `babel-plugin-react-compiler` aligned with the React Compiler rollout notes when upgrading Next or React.
- Build time should be watched before widening compiler coverage.
- Do not switch to full compilation until the app has a React Compiler lint/audit path. The current repo uses Biome instead of ESLint, so `eslint-plugin-react-hooks` `recommended-latest` is a follow-up decision rather than part of this first slice.
- For any component that behaves incorrectly after annotation, remove `"use memo"` or add `"use no memo"` while investigating.
- Re-check the required `babel-plugin-react-compiler` version whenever Next or React is upgraded.
- When verifying compiled output on React 19, look for `react/compiler-runtime` rather than `react-compiler-runtime`.

## Verification

- Run `pnpm --filter @solid-connect/web build` and confirm the compiled server/client output references `react/compiler-runtime`.
- Run `pnpm --filter @solid-connect/web ci:check` before merging.
