import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/route-proxy";

export async function GET(request: NextRequest) {
  return proxyToBackend(request, "/categories");
}

