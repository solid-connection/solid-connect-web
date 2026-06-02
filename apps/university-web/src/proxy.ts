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

const DEFAULT_INDEXABLE_HOSTS = ["www.solid-connection.com", "solid-connection.com"];

const indexableHosts = new Set(
  (process.env.UNIVERSITY_WEB_INDEXABLE_HOSTS ?? DEFAULT_INDEXABLE_HOSTS.join(","))
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean),
);

const isStageHostname = (hostname: string) => hostname.includes("stage");

const getRequestHostname = (request: NextRequest) => {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.hostname;
  return host.split(":")[0];
};

const isNonIndexHostname = (hostname: string) => isStageHostname(hostname) || !indexableHosts.has(hostname);

const isProbePath = (pathname: string) => {
  if (blockedExactPaths.has(pathname)) {
    return true;
  }

  if (pathname.endsWith(".php")) {
    return true;
  }

  return blockedPathPrefixes.some((prefix) => pathname.startsWith(prefix));
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/robots.txt" && isNonIndexHostname(getRequestHostname(request))) {
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
    "/((?!api|_next/static|_next/image|static/chunks|images|assets|favicon.ico|sitemap.xml|sw.js|viewer|fonts|.*\\.splat).*)",
  ],
};
