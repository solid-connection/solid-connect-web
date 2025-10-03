import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const loginNeedPages = ["/mentor", "/my", "/community/"]; // 로그인 필요페이지

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // localhost 환경에서는 미들웨어 적용 X
  // if (url.hostname === "localhost") {
  //   return NextResponse.next();
  // }

  // 쿠키 기반 인증이 활성화된 경우에만 미들웨어 적용
  const isCookieAuthEnabled = process.env.NEXT_PUBLIC_COOKIE_LOGIN_ENABLED === "true";
  if (!isCookieAuthEnabled) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 정확한 경로 매칭 - startsWith 대신 정확한 경로나 세그먼트 기반 매칭 사용
  const needLogin = loginNeedPages.some((path) => {
    return url.pathname === path || url.pathname.match(new RegExp(`^${path}(/|$)`));
  });

  if (needLogin && !refreshToken) {
    url.pathname = "/login";
    // 전체 URL(pathname + search) 보존하여 리다이렉트 파라미터에 설정
    const redirectUrl = request.nextUrl.pathname + request.nextUrl.search;
    url.searchParams.set("redirect", redirectUrl);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|static/chunks|images|assets|favicon.ico|sw.js|viewer|fonts|.*\\.splat).*)",
  ],
};
