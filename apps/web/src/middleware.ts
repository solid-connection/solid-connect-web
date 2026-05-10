import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|static/chunks|images|assets|favicon.ico|robots.txt|sitemap.xml|sw.js|viewer|fonts|.*\\.splat).*)",
  ],
};
