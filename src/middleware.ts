import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const loginNeedPages = ["/mentor", "/my", "/community"]; // 임시 관리 배열

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const needLogin = loginNeedPages.some((path) => url.pathname.startsWith(path));

  if (needLogin && !refreshToken) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
