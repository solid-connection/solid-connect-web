import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const loginNeedPages = ["/mentor", "/my", "/community"]; // 로그인 필요페이지
const NEED_LOGIN_COOKIE_KEY = "isNeedLogin";
const blockedExactPaths = new Set([
  "/database.php",
  "/db.php",
  "/config.php",
  "/phpinfo.php",
  "/xmlrpc.php",
  "/wp-login.php",
]);
const blockedPathPrefixes = ["/wp-admin", "/phpmyadmin", "/pma", "/.env", "/.git", "/vendor"];

const isStageHostname = (hostname: string) => hostname.includes("stage");
const isLocalHostname = (hostname: string) => hostname === "localhost" || hostname === "127.0.0.1";

const isProbePath = (pathname: string) => {
  if (blockedExactPaths.has(pathname)) {
    return true;
  }

  if (pathname.endsWith(".php")) {
    return true;
  }

  return blockedPathPrefixes.some((prefix) => pathname.startsWith(prefix));
};

const buildLoginRedirectResponse = (
  request: NextRequest,
  options: {
    clearRefreshToken?: boolean;
  } = {},
) => {
  const { clearRefreshToken = false } = options;
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/login";
  redirectUrl.search = "";

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set({
    name: NEED_LOGIN_COOKIE_KEY,
    value: "true",
    path: "/",
    sameSite: "lax",
    maxAge: 60,
  });

  if (clearRefreshToken) {
    response.cookies.set({
      name: "refreshToken",
      value: "",
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });
  }

  return response;
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/robots.txt" && isStageHostname(request.nextUrl.hostname)) {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=600",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }

  if (isProbePath(pathname)) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  // local 개발 환경에서는 서버 도메인 쿠키와 분리되어 refreshToken을 신뢰할 수 없으므로 로그인 가드를 스킵한다.
  if (isLocalHostname(request.nextUrl.hostname)) {
    return NextResponse.next();
  }

  // HTTP-only 쿠키의 refreshToken 확인
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 정확한 경로 매칭
  const needLogin = loginNeedPages.some((path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  });

  if (needLogin && !refreshToken) {
    return buildLoginRedirectResponse(request);
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|static/chunks|images|assets|favicon.ico|sw.js|viewer|fonts|.*\\.splat).*)",
  ],
};
