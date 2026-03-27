import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const loginNeedPages = ["/mentor", "/my", "/community"]; // 로그인 필요페이지
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

const isProbePath = (pathname: string) => {
  if (blockedExactPaths.has(pathname)) {
    return true;
  }

  if (pathname.endsWith(".php")) {
    return true;
  }

  return blockedPathPrefixes.some((prefix) => pathname.startsWith(prefix));
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (pathname === "/robots.txt" && isStageHostname(url.hostname)) {
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

  // localhost 환경에서는 미들웨어 적용 X
  // if (url.hostname === "localhost") {
  //   return NextResponse.next();
  // }

  // HTTP-only 쿠키의 refreshToken 확인
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 정확한 경로 매칭
  const needLogin = loginNeedPages.some((path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  });

  if (needLogin && !refreshToken) {
    url.pathname = "/login";
    url.searchParams.delete("reason");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|static/chunks|images|assets|favicon.ico|sw.js|viewer|fonts|.*\\.splat).*)",
  ],
};
