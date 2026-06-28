import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-[color:var(--border)] bg-[#210038]/80 shadow-[var(--shadow)] transition hover:-translate-y-1 hover:border-violet-300/45">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.nombre}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <span className="bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">
            {product.category?.nombre || "Sin categoria"}
          </span>
          <p className="text-xl font-bold text-violet-200">
            {formatCurrency(product.precio)}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <h2 className="font-display text-2xl leading-tight text-white">
            {product.nombre}
          </h2>
          <p className="line-clamp-3 text-sm leading-7 text-[color:var(--muted)]">
            {product.descripcion}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-[color:var(--muted)]">SKU #{product.id}</p>
          <Link
            href={`/products/${product.id}`}
            className="bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition group-hover:bg-[color:var(--accent-strong)]"
          >
            Ver producto
          </Link>
        </div>
      </div>
    </article>
  );
}
