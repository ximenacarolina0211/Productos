import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/route-proxy";

type ProductRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: ProductRouteProps) {
  const { id } = await params;
  return proxyToBackend(request, `/products/${id}`);
}

export async function PUT(request: NextRequest, { params }: ProductRouteProps) {
  const { id } = await params;
  return proxyToBackend(request, `/products/${id}`);
}

export async function DELETE(
  request: NextRequest,
  { params }: ProductRouteProps,
) {
  const { id } = await params;
  return proxyToBackend(request, `/products/${id}`);
}

