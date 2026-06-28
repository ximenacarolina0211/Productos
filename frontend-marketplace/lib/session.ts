import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_EMAIL_COOKIE,
  AUTH_NAME_COOKIE,
  AUTH_ROLE_COOKIE,
  AUTH_TOKEN_COOKIE,
} from "@/lib/auth-constants";
import { AuthenticatedUser, UserRole } from "@/types/auth";

type SessionPayload = {
  token: string;
  user: AuthenticatedUser;
};

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const role = cookieStore.get(AUTH_ROLE_COOKIE)?.value as UserRole | undefined;
  const nombre = cookieStore.get(AUTH_NAME_COOKIE)?.value;
  const email = cookieStore.get(AUTH_EMAIL_COOKIE)?.value;

  if (!token || !role || !nombre || !email) {
    return null;
  }

  return {
    token,
    user: {
      id: 0,
      nombre,
      email,
      role,
    },
  };
}

function buildCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export function writeSessionCookies(
  response: NextResponse,
  payload: SessionPayload,
) {
  const cookieOptions = buildCookieOptions();

  response.cookies.set(AUTH_TOKEN_COOKIE, payload.token, cookieOptions);
  response.cookies.set(AUTH_ROLE_COOKIE, payload.user.role, cookieOptions);
  response.cookies.set(AUTH_NAME_COOKIE, payload.user.nombre, cookieOptions);
  response.cookies.set(AUTH_EMAIL_COOKIE, payload.user.email, cookieOptions);
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(AUTH_TOKEN_COOKIE, "", {
    ...buildCookieOptions(),
    maxAge: 0,
  });
  response.cookies.set(AUTH_ROLE_COOKIE, "", {
    ...buildCookieOptions(),
    maxAge: 0,
  });
  response.cookies.set(AUTH_NAME_COOKIE, "", {
    ...buildCookieOptions(),
    maxAge: 0,
  });
  response.cookies.set(AUTH_EMAIL_COOKIE, "", {
    ...buildCookieOptions(),
    maxAge: 0,
  });
}

