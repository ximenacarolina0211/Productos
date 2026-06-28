import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_ROLE_COOKIE,
  getDefaultRouteForRole,
} from "@/lib/auth-constants";
import { UserRole } from "@/types/auth";

function isCatalogRoute(pathname: string) {
  return pathname === "/" || pathname.startsWith("/products/");
}

function isAuthRoute(pathname: string) {
  return pathname === "/login" || pathname === "/register";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(AUTH_ROLE_COOKIE)?.value as UserRole | undefined;

  if (!role && (isCatalogRoute(pathname) || pathname.startsWith("/admin"))) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (role && isAuthRoute(pathname)) {
    return NextResponse.redirect(
      new URL(getDefaultRouteForRole(role), request.url),
    );
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/products/:path*", "/admin/:path*", "/login", "/register"],
};
