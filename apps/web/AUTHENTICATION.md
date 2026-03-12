# Authentication & Authorization

## Login Redirect Flow

### Overview

The application implements a comprehensive login redirect system that ensures users are properly authenticated before accessing protected pages.

### Protected Pages

The following pages require authentication:
- `/mentor/*` - All mentor-related pages
- `/my/*` - All user profile pages
- `/community` and `/community/*` - Entire community experience, including board lists, post detail, creation, and modification

### How It Works

#### 1. Middleware Detection

The middleware (`apps/web/src/middleware.ts`) checks for authentication on every request:

```typescript
const loginNeedPages = ["/mentor", "/my", "/community"];
const needLogin = loginNeedPages.some((path) => {
  return url.pathname === path || url.pathname.startsWith(`${path}/`);
});
```

#### 2. Community Redirect Reason

When an unauthenticated user tries to access a protected page:
- Middleware redirects to `/login`
- Community routes include a reason marker so the login page can explain why access was blocked
- Example: `/login?reason=community-members-only`

```typescript
if (needLogin && !refreshToken) {
  const isCommunityRoute = url.pathname === "/community" || url.pathname.startsWith("/community/");
  url.pathname = "/login";
  if (isCommunityRoute) {
    url.searchParams.set("reason", "community-members-only");
  }
  return NextResponse.redirect(url);
}
```

#### 3. Toast Notification

The login page displays a one-time toast message when users are redirected from community routes:

```typescript
// apps/web/src/app/login/LoginContent.tsx
useEffect(() => {
  const reason = searchParams.get("reason");
  if (reason === "community-members-only") {
    toast.info("커뮤니티는 회원 전용입니다. 로그인 후 이용해주세요.");
    router.replace(pathname);
  }
}, [pathname, router, searchParams]);
```

#### 4. Post-Login Redirect

After successful authentication, users continue to be redirected to `/`.

### Configuration

Authentication mode is controlled by environment variable:

```env
NEXT_PUBLIC_COOKIE_LOGIN_ENABLED=true
```

When `true`:
- Uses HTTP-only cookies for refresh tokens
- Middleware enforces authentication checks
- Enhanced security

When `false`:
- Uses localStorage for tokens
- No middleware checks (development/testing mode)

### Token Management

#### Refresh Token
- Stored in HTTP-only cookie (secure)
- Used for authentication checks in middleware
- Automatically renewed on valid requests

#### Access Token
- Stored in Zustand store or localStorage
- Used for API requests
- Short-lived for security

### Adding New Protected Routes

To protect a new route:

1. Add to `loginNeedPages` array in middleware:
```typescript
const loginNeedPages = ["/mentor", "/my", "/new-route"];
```

2. Or add custom logic for sub-routes:
```typescript
const isNewRouteSubPath = url.pathname.startsWith("/new-route/");
const needLogin = loginNeedPages.some(...) || isNewRouteSubPath;
```

### Troubleshooting

#### Redirect not working?
- Check if `NEXT_PUBLIC_COOKIE_LOGIN_ENABLED=true` in `.env`
- Verify refresh token exists in cookies
- Check middleware matcher pattern excludes static files

#### Toast not showing?
- Ensure `reason=community-members-only` query parameter is present for community access
- Check `LoginContent.tsx` useEffect is running
- Verify toast store is initialized

### Security Considerations

1. **HTTP-Only Cookies**: Refresh tokens are never accessible to JavaScript
2. **Middleware Protection**: Server-side check before page renders
3. **Token Expiry**: Short-lived access tokens minimize exposure
4. **Scoped Login Reasons**: Community-only messaging is controlled by a fixed internal `reason` value

### Related Files

- `apps/web/src/middleware.ts` - Authentication middleware
- `apps/web/src/app/login/LoginContent.tsx` - Login page with redirect handling
- `apps/web/src/lib/zustand/useAuthStore.ts` - Auth state management
- `apps/web/.env` - Configuration

### Issue Reference

This implementation resolves issue #302: "로그인 필요 페이지 분리 작업 + proxy 에서 리디렉션 처리"

The login reason marker and toast notification help users understand why community access was blocked.
