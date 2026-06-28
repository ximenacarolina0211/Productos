import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/route-proxy";

export async function GET(request: NextRequest) {
  return proxyToBackend(request, "/products");
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, "/products");
}

