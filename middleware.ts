import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/"];
const ADMIN_ROUTES = ["/auth/dashboard/"];
const DASHBOARD = "/auth/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);

  if (isPublicRoute) {
    if (token) {
      return NextResponse.redirect(new URL(DASHBOARD, request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1]!, "base64").toString(),
      ) as { role: string };

      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL(DASHBOARD, request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
