import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const loginNeedPages = ["/mentor", "/my"]; // 로그인 필요페이지

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // localhost 환경에서는 미들웨어 적용 X
  // if (url.hostname === "localhost") {
  //   return NextResponse.next();
  // }

  // HTTP-only 쿠키의 refreshToken 확인
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 정확한 경로 매칭
  const needLogin = loginNeedPages.some((path) => {
    return url.pathname === path || url.pathname.startsWith(`${path}/`);
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
