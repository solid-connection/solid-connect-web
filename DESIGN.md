---
omd: 0.1
brand: Solid Connection
bootstrapped_from: skyscanner
bootstrapped_at: 2026-07-14T03:31:28.000Z
---

# Solid Connection Desktop Layout System

This specification uses Skyscanner Backpack as a structural reference only. Solid Connection's visual identity is locked: existing colors, Pretendard typography, icons, copy style, component surfaces, and data behavior remain authoritative.

## 1. Visual Theme

- Keep the current calm, practical exchange-student product aesthetic.
- Do not copy Skyscanner colors, fonts, logo, illustrations, travel photography, or branded copy.
- Use Skyscanner only for desktop composition: a horizontal product navigation, a prominent task-entry area, centered wide content, filters beside results, and clear result density.
- Prefer functional product layouts over marketing-style hero sections.

## 2. Color Tokens

Colors are inherited from `apps/web/tailwind.config.ts` and must not be replaced by Skyscanner tokens.

| Role | Token | Value |
|---|---|---|
| Primary action | `primary` | `#5950F6` |
| Secondary action | `secondary` | `#4672EE` |
| Primary tint | `primary-100` | `#EFEEFF` |
| Secondary tint | `secondary-100` | `#E8EDFD` |
| Canvas | `k-0` | `#FFFFFF` |
| Page background | `k-50` | `#F5F5F5` |
| Border | `k-100` | `#DDDDDF` |
| Primary text | `k-900` | `#1A1F27` |
| Secondary text | `k-500` | `#76797D` |

Existing semantic accent colors remain allowed in their current domain-specific components. Do not introduce `#0062e3`, `#05203c`, Skyscanner teal, or Skyscanner error colors.

## 3. Typography

- Use the existing Pretendard variable font everywhere.
- Keep the existing `typo-*` utilities and their current values.
- Page title: `typo-bold-1` unless an existing page intentionally uses a smaller hierarchy.
- Section title: `typo-bold-4` or the existing local token.
- Body and metadata: preserve current `typo-medium-*` / `typo-regular-*` choices.
- Do not add Skyscanner Relative, Larken, viewport-scaled type, or negative letter spacing.

## 4. Desktop Layout

- Desktop begins at the repository's existing `md` breakpoint.
- Use one horizontal product navigation at the top. Keep it visible while scrolling.
- Center page content in a `1280px` maximum-width stage with `32-40px` side padding.
- Use a full-width task-entry band near the top of workflow-heavy pages.
- Results pages use a primary content column plus a `300-380px` filter/summary rail where useful.
- Dense card collections use responsive 2-4 column grids; long textual content remains a readable single column.
- Sticky rails sit below the top navigation, never underneath it.
- Auth and focused forms use a centered two-column composition only when the supporting panel adds real context.

## 5. Mobile Layout

- Preserve the current mobile UI and bottom navigation.
- Do not force desktop grids, horizontal product navigation, or wide containers onto mobile.
- Mobile remains single-column and keeps existing route-specific navigation and fixed actions.

## 6. Components

The builder-selected components are `button`, `input`, `table`, `card`, `badge`, `tabs`, and `dialog`. Their visual language remains the current Solid Connection implementation.

- Buttons: current primary/secondary colors, existing radius, existing heights, and current disabled behavior.
- Inputs: current border, radius, focus behavior, and error treatment.
- Cards: white surface, `k-100` border, existing 8px radius, subtle current shadows only.
- Badges and tabs: current primary tint/primary text treatment; do not import Skyscanner pill or navy-chip styling.
- Tables and rows: prioritize scanability and stable columns; preserve current semantic colors.
- Dialogs: preserve existing modal components and interaction behavior.

## 7. Navigation

- Desktop uses a white top bar with the Solid Connection cloud mark and wordmark.
- Primary sections remain 학교, 커뮤니티, 홈, 멘토, 마이.
- Active navigation uses existing primary colors and a subtle tinted surface.
- Mobile keeps the existing bottom navigation unchanged.

## 8. Responsive Behavior

| Width | Behavior |
|---|---|
| `<768px` | Existing mobile single-column UI |
| `768-1023px` | Compact desktop navigation, mostly single-column content |
| `1024-1279px` | Two-column workflows and wider card grids |
| `>=1280px` | Centered `1280px` stage, full result/filter composition |

- Minimum interactive target remains 44px where the current component supports it.
- Long Korean labels must wrap or truncate deliberately; they must not overlap adjacent content.
- No horizontal page overflow at 390px, 1024px, or 1440px.

## 9. States

- Preserve existing loading, empty, error, disabled, and selected states.
- Skeleton dimensions should match final card dimensions to avoid layout shift.
- Empty and error states stay inside the same desktop stage as successful content.
- Do not replace domain-specific messages with Skyscanner copy.

## 10. Motion

- Preserve current restrained transitions.
- Hover elevation and translation should remain subtle and must not shift surrounding layout.
- Honor `prefers-reduced-motion` for newly introduced motion.
- Do not add decorative motion, carousel movement, or Skyscanner signature animations.

## 11. Implementation Guardrails

- Layout changes may reorganize existing components but must not change API calls, route behavior, or business rules.
- Reuse existing components and Tailwind tokens before introducing new abstractions.
- A page is complete only after desktop and mobile browser verification, overflow checks, broken-image checks, and console review.
- Skyscanner is an inspiration source, not a visual clone. The final screen must still be immediately recognizable as Solid Connection.
