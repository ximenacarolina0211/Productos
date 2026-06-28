import { UserRole } from "@/types/auth";

export const AUTH_TOKEN_COOKIE = "marketplace_token";
export const AUTH_ROLE_COOKIE = "marketplace_role";
export const AUTH_NAME_COOKIE = "marketplace_name";
export const AUTH_EMAIL_COOKIE = "marketplace_email";

export function getDefaultRouteForRole(role?: UserRole) {
  return role === "ADMIN" ? "/admin" : "/";
}

