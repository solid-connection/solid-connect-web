# Authentication & Authorization

## Login Redirect Flow

### Overview

The application implements a comprehensive login redirect system that ensures users are properly authenticated before accessing protected pages.

### Protected Pages

The following pages require authentication:
- `/mentor/*` - All mentor-related pages
- `/my/*` - All user profile pages
- `/community/[boardCode]/*` - Community sub-routes (post creation, modification)

### How It Works

#### 1. Middleware Detection

The middleware (`apps/web/src/middleware.ts`) checks for authentication on every request:

```typescript
const loginNeedPages = ["/mentor", "/my"];
const needLogin = loginNeedPages.some((path) => {
  return url.pathname === path || url.pathname.startsWith(`${path}/`);
}) || isCommunitySubRoute;
```

#### 2. Redirect Parameter

When an unauthenticated user tries to access a protected page:
- Middleware redirects to `/login`
- Original URL is preserved in the `redirect` query parameter
- Example: `/login?redirect=/mentor/chat/123`

```typescript
if (needLogin && !refreshToken) {
  url.pathname = "/login";
  const redirectUrl = request.nextUrl.pathname + request.nextUrl.search;
  url.searchParams.set("redirect", redirectUrl);
  return NextResponse.redirect(url);
}
```

#### 3. Toast Notification

The login page displays a toast message when users are redirected:

```typescript
// apps/web/src/app/login/LoginContent.tsx
useEffect(() => {
  const redirect = searchParams.get("redirect");
  if (redirect) {
    toast.info("로그인이 필요합니다.");
  }
}, [searchParams]);
```

#### 4. Post-Login Redirect

After successful authentication, users are redirected back to their original destination.

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
- Ensure `redirect` query parameter is present
- Check `LoginContent.tsx` useEffect is running
- Verify toast store is initialized

### Security Considerations

1. **HTTP-Only Cookies**: Refresh tokens are never accessible to JavaScript
2. **Middleware Protection**: Server-side check before page renders
3. **Token Expiry**: Short-lived access tokens minimize exposure
4. **Redirect Validation**: Only internal URLs are allowed in redirect parameter

### Related Files

- `apps/web/src/middleware.ts` - Authentication middleware
- `apps/web/src/app/login/LoginContent.tsx` - Login page with redirect handling
- `apps/web/src/lib/zustand/useAuthStore.ts` - Auth state management
- `apps/web/.env` - Configuration

### Issue Reference

This implementation resolves issue #302: "로그인 필요 페이지 분리 작업 + proxy 에서 리디렉션 처리"

The redirect parameter and toast notification features ensure users understand why they were redirected and can seamlessly return to their intended destination after login.
