import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, readErrorMessage } from "@/lib/api";
import { writeSessionCookies } from "@/lib/session";
import { AuthenticatedUser } from "@/types/auth";

type AuthPayload = {
  token: string;
  user: AuthenticatedUser;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "No se pudo conectar con el servidor. Verifica que el backend este encendido." },
      { status: 503 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { message: await readErrorMessage(response) },
      { status: response.status },
    );
  }

  const data = (await response.json()) as AuthPayload;
  const nextResponse = NextResponse.json({ user: data.user });

  writeSessionCookies(nextResponse, data);

  return nextResponse;
}
