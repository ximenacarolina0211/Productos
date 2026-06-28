import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth-constants";

export async function proxyToBackend(request: NextRequest, path: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();

  const response = await fetch(`${API_BASE_URL}${path}${request.nextUrl.search}`, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  const responseBody = await response.text();
  const proxiedResponse = new NextResponse(responseBody, {
    status: response.status,
  });
  const responseContentType = response.headers.get("content-type");

  if (responseContentType) {
    proxiedResponse.headers.set("content-type", responseContentType);
  }

  return proxiedResponse;
}

