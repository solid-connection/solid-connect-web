import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const loginNeedPages = ["/mentor", "/my"]; // 로그인 필요페이지

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // localhost 환경에서는 미들웨어 적용 X
  // if (url.hostname === "localhost") {
  //   return NextResponse.next();
  // }

  // 서버 사이드 인증 체크가 활성화된 경우에만 미들웨어 적용
  // (RefreshToken은 항상 HTTP-only 쿠키로 관리됨)
  const isServerSideAuthEnabled = process.env.NEXT_PUBLIC_COOKIE_LOGIN_ENABLED === "true";
  if (!isServerSideAuthEnabled) {
    return NextResponse.next();
  }

  // HTTP-only 쿠키의 refreshToken 확인
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // /community는 통과, /community/ 하위 경로는 로그인 필요
  const isCommunitySubRoute = url.pathname.startsWith("/community/");

  // 정확한 경로 매칭
  const needLogin =
    loginNeedPages.some((path) => {
      return url.pathname === path || url.pathname.startsWith(path + "/");
    }) || isCommunitySubRoute; // /community/ 하위 경로도 로그인 필요

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
