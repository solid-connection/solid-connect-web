# Login Instability Investigation Guide

## Scope
- Symptoms: sudden redirect to `/login`, intermittent 401, or authenticated user UI showing as unauthenticated.
- Target routes: `/my`, `/mentor`, `/community/*`.

## Enable Auth Debug Logs
1. Open browser devtools console.
2. Run `localStorage.setItem("authDebug", "1")`.
3. Hard refresh.
4. Reproduce once.
5. Export logs with:
   - `copy(JSON.stringify(window.__AUTH_DEBUG_LOGS__ ?? [], null, 2))`

Optional (server-side middleware logs):
- Set `NEXT_PUBLIC_AUTH_DEBUG=true` and run the app.
- Middleware prints `[AUTH_DEBUG][middleware.*]` logs in server output.

## Reproduction Matrix
1. Logged-in user hard refreshes `/my`.
2. Logged-in user hard refreshes `/mentor`.
3. Logged-in user navigates to `/community` and `/community/[boardCode]/create`.
4. User with expired access token but valid refresh token opens protected route.
5. User keeps app idle until access token expires, then triggers API call.

## What To Check
- `request.start` with `hasAccessToken=true` and `tokenExpired=true`.
- Immediate `response.401` after sending expired access token.
- Whether `reissue.start` appears before redirect.
- `auth.redirectToLogin` reason/message and preceding request URL.
- Middleware redirect events where `hasRefreshToken=false`.

## Interpretation Rules
- `tokenExpired=true` + no `reissue.start` + `response.401`:
  likely missing proactive refresh for expired access tokens.
- Frequent `reissue.failed` while middleware has refresh cookie:
  likely backend `/auth/reissue` or cookie attribute/domain issue.
- Multiple `reissue.start` from same user action:
  possible reissue concurrency/race condition.
- Middleware redirects before app boot:
  refresh token cookie missing/expired at edge layer.

## Deliverables
- Reproduction steps used.
- Exported `window.__AUTH_DEBUG_LOGS__` JSON.
- Network HAR covering `/auth/reissue` and first failing 401.
- Suspected root cause category:
  - token expiry handling
  - refresh failure/cookie issue
  - race condition
  - route guard mismatch
