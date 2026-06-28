import { cookies } from "next/headers";
import { ApiError, API_BASE_URL, readErrorMessage } from "@/lib/api";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth-constants";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

async function serverApiFetch<T>(path: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return (await response.json()) as T;
}

export function getServerProducts(categoryId?: string) {
  const searchParams = new URLSearchParams();

  if (categoryId) {
    searchParams.set("categoryId", categoryId);
  }

  const query = searchParams.toString();

  return serverApiFetch<Product[]>(`/products${query ? `?${query}` : ""}`);
}

export function getServerProduct(id: string | number) {
  return serverApiFetch<Product>(`/products/${id}`);
}

export function getServerCategories() {
  return serverApiFetch<Category[]>("/categories");
}

