import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken, verifyUserToken } from "@/lib/auth";

function getTokenFromCookie(request: NextRequest, name: string): string | null {
  return request.cookies.get(name)?.value ?? null;
}

function getTokenFromHeader(request: NextRequest): string | null {
  const auth = request.headers.get("Authorization");
  return auth?.startsWith("Bearer ") ? auth.slice(7) : null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin page protection (not the login page itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = getTokenFromCookie(request, "admin_token");
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // User-protected pages
  if (pathname === "/feed" || pathname === "/preferences") {
    const token = getTokenFromCookie(request, "user_token");
    if (!token || !verifyUserToken(token)) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/feed", "/preferences"],
};
