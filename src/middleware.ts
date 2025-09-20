import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const loginNeedPages = ["/mentor", "/my", "/community"]; // 임시 관리 배열

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // localhost 환경에서는 미들웨어 적용 X
  // if (url.hostname === "localhost") {
  //   return NextResponse.next();
  // }

  const refreshToken = request.cookies.get("refreshToken")?.value;
  const needLogin = loginNeedPages.some((path) => url.pathname.startsWith(path));

  if (needLogin && !refreshToken) {
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
