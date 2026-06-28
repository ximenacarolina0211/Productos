import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { getServerProduct } from "@/lib/server-api";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  let errorMessage = "";
  let product: Product | null = null;

  try {
    product = await getServerProduct(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    errorMessage =
      error instanceof Error
        ? error.message
        : "No fue posible obtener el producto.";
  }

  if (!product) {
    return (
      <section className="border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
          Conexion
        </p>
        <h1 className="mt-4 font-display text-4xl text-white">
          Producto no disponible.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
          {errorMessage}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white"
        >
          Regresar al catalogo
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <section className="overflow-hidden border border-[color:var(--border)] bg-[#210038]/80 shadow-[var(--shadow)]">
        <div className="relative aspect-[4/3]">
          <Image
            src={product.imageUrl}
            alt={product.nombre}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </section>

      <aside className="border border-[color:var(--border)] bg-[linear-gradient(160deg,rgba(76,29,149,0.96),rgba(30,0,50,0.92))] p-8 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.32em] text-violet-200">
          {product.category?.nombre || "Sin categoria"}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-white">
          {product.nombre}
        </h1>
        <p className="mt-5 text-base leading-7 text-violet-100">
          {product.descripcion}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="border border-white/15 bg-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-violet-200">
              Precio
            </p>
            <p className="mt-3 text-3xl font-bold text-white">
              {formatCurrency(product.precio)}
            </p>
          </div>
          <div className="border border-white/15 bg-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-violet-200">
              Categoria
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              {product.category?.nombre || "Sin categoria"}
            </p>
          </div>
          <div className="border border-white/15 bg-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-violet-200">
              SKU
            </p>
            <p className="mt-3 text-lg font-semibold text-white">#{product.id}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="bg-white px-5 py-3 text-sm font-semibold text-[#3b0764] transition hover:bg-violet-100"
          >
            Volver al catalogo
          </Link>
          <Link
            href="/admin"
            className="border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Administrar
          </Link>
        </div>
      </aside>
    </div>
  );
}
