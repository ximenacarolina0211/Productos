import { NextRequest, NextResponse } from "next/server";

type UserRole = "ADMIN" | "CUSTOMER";

const AUTH_ROLE_COOKIE = "marketplace_role";

function getDefaultRouteForRole(role?: UserRole) {
  return role === "ADMIN" ? "/admin" : "/";
}

function isCatalogRoute(pathname: string) {
  return pathname === "/" || pathname.startsWith("/products/");
}

function isAuthRoute(pathname: string) {
  return pathname === "/login" || pathname === "/register";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(AUTH_ROLE_COOKIE)?.value as
    | UserRole
    | undefined;

  if (!role && (isCatalogRoute(pathname) || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login", request.url));
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
