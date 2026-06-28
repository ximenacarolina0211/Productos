import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import { formatCurrency } from "@/lib/format";
import { getServerCategories, getServerProducts } from "@/lib/server-api";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{
    categoryId?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const { categoryId } = await searchParams;
  let products: Product[] = [];
  let categories: Category[] = [];
  let errorMessage = "";

  try {
    [products, categories] = await Promise.all([
      getServerProducts(categoryId),
      getServerCategories(),
    ]);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "No fue posible obtener los productos.";
  }

  const averagePrice =
    products.length > 0
      ? products.reduce((total, product) => total + product.precio, 0) /
        products.length
      : 0;
  const selectedCategory = categories.find(
    (category) => String(category.id) === categoryId,
  );

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(76,29,149,0.96),rgba(24,0,38,0.92))] shadow-[var(--shadow)]">
        <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-violet-200">
                Store dashboard
              </p>
              <h1 className="mt-5 max-w-2xl font-display text-5xl leading-[1.02] text-white sm:text-6xl">
                Productos listos para vender.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-violet-100">
                Revisa inventario, precios y categorias desde una vista directa
                para tomar decisiones rapido.
              </p>
            </div>

            <div className="max-w-3xl">
              <CategoryFilter
                categories={categories}
                selectedCategoryId={categoryId}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <article className="border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-violet-200">
                Stock visible
              </p>
              <p className="mt-3 text-4xl font-bold text-white">
                {products.length}
              </p>
            </article>
            <article className="border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-violet-200">
                Ticket medio
              </p>
              <p className="mt-3 text-3xl font-bold text-white">
                {products.length > 0 ? formatCurrency(averagePrice) : "--"}
              </p>
            </article>
            <article className="border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-violet-200">
                Segmento
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {selectedCategory?.nombre || "Todos"}
              </p>
            </article>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <section className="border border-red-300/40 bg-red-950/40 p-5 text-red-100 shadow-[var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.24em]">Conexion</p>
          <p className="mt-3 max-w-3xl text-sm leading-6">{errorMessage}</p>
        </section>
      ) : null}

      <section id="catalogo" className="space-y-5">
        <div className="flex flex-col gap-3 border-b border-[color:var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
              Catalogo comercial
            </p>
            <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">
              {selectedCategory ? selectedCategory.nombre : "Todos los productos"}
            </h2>
          </div>
          <p className="text-sm font-semibold text-violet-200">
            {products.length} resultados
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[color:var(--border-strong)] bg-white/5 px-8 py-12 text-center text-[color:var(--muted)]">
            No hay productos para el filtro seleccionado.
          </div>
        )}
      </section>
    </div>
  );
}
