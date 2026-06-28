"use client";

import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  startTransition,
  useEffect,
  useState,
} from "react";
import { formatCurrency } from "@/lib/format";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

type ProductForm = {
  nombre: string;
  precio: string;
  descripcion: string;
  imageUrl: string;
  categoryId: string;
};

const initialForm: ProductForm = {
  nombre: "",
  precio: "",
  descripcion: "",
  imageUrl: "",
  categoryId: "",
};

async function readMessage(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || "La operacion no pudo completarse.";
  } catch {
    return "La operacion no pudo completarse.";
  }
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    "Gestiona el catalogo comercial desde este panel.",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchBootstrapData(signal?: AbortSignal) {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch("/api/products", {
        cache: "no-store",
        signal,
      }),
      fetch("/api/categories", {
        cache: "no-store",
        signal,
      }),
    ]);

    if (!productsResponse.ok) {
      throw new Error(await readMessage(productsResponse));
    }

    if (!categoriesResponse.ok) {
      throw new Error(await readMessage(categoriesResponse));
    }

    return {
      products: (await productsResponse.json()) as Product[],
      categories: (await categoriesResponse.json()) as Category[],
    };
  }

  async function loadData() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchBootstrapData();
      startTransition(() => {
        setProducts(data.products);
        setCategories(data.categories);
      });
      setStatusMessage(
        `Se cargaron ${data.products.length} productos y ${data.categories.length} categorias.`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible cargar la informacion.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function bootstrapData() {
      try {
        const data = await fetchBootstrapData(controller.signal);
        startTransition(() => {
          setProducts(data.products);
          setCategories(data.categories);
        });
        setStatusMessage(
          `Se cargaron ${data.products.length} productos y ${data.categories.length} categorias.`,
        );
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No fue posible cargar la informacion.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void bootstrapData();

    return () => {
      controller.abort();
    };
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function resetForm() {
    startTransition(() => {
      setForm(initialForm);
      setEditingId(null);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const endpoint = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: form.nombre,
          precio: Number(form.precio),
          descripcion: form.descripcion,
          imageUrl: form.imageUrl,
          categoryId: Number(form.categoryId),
        }),
      });

      if (!response.ok) {
        throw new Error(await readMessage(response));
      }

      const savedProduct = (await response.json()) as Product;
      setStatusMessage(
        editingId
          ? `Producto actualizado: ${savedProduct.nombre}`
          : `Producto creado: ${savedProduct.nombre}`,
      );
      resetForm();
      await loadData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el producto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(product: Product) {
    startTransition(() => {
      setEditingId(product.id);
      setForm({
        nombre: product.nombre,
        precio: String(product.precio),
        descripcion: product.descripcion,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId ? String(product.categoryId) : "",
      });
    });
    setStatusMessage(`Editando el producto #${product.id}.`);
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Se eliminara el producto "${product.nombre}". Deseas continuar?`,
    );

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await readMessage(response));
      }

      setStatusMessage(`Producto eliminado: ${product.nombre}`);

      if (editingId === product.id) {
        resetForm();
      }

      await loadData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible eliminar el producto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="border border-[color:var(--border)] bg-[#210038]/85 p-8 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.32em] text-violet-200">
          Operacion
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-white">
          Gestion del catalogo.
        </h1>
        <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">
          Crea, actualiza y depura los productos que se muestran en la tienda.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Nombre</span>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border border-[color:var(--border-strong)] bg-white/95 px-4 py-3 text-[#210038] outline-none transition focus:border-[color:var(--accent)]"
              placeholder="Ej. Smartwatch Xiaomi Mi Band 9"
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Precio</span>
              <input
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
                className="w-full border border-[color:var(--border-strong)] bg-white/95 px-4 py-3 text-[#210038] outline-none transition focus:border-[color:var(--accent)]"
                placeholder="199.90"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Categoria</span>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full border border-[color:var(--border-strong)] bg-white/95 px-4 py-3 text-[#210038] outline-none transition focus:border-[color:var(--accent)]"
                required
              >
                <option value="">Selecciona una categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Image URL</span>
            <input
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full border border-[color:var(--border-strong)] bg-white/95 px-4 py-3 text-[#210038] outline-none transition focus:border-[color:var(--accent)]"
              placeholder="https://..."
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Descripcion</span>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="min-h-36 w-full border border-[color:var(--border-strong)] bg-white/95 px-4 py-3 text-[#210038] outline-none transition focus:border-[color:var(--accent)]"
              placeholder="Describe las caracteristicas principales del producto."
              required
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? "Actualizar producto" : "Crear producto"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-[color:var(--border-strong)] px-5 py-3 text-sm font-semibold text-white"
            >
              Limpiar formulario
            </button>
          </div>
        </form>
      </section>

      <section className="border border-[color:var(--border)] bg-[#210038]/85 p-8 shadow-[var(--shadow)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-violet-200">
              Estado
            </p>
            <h2 className="mt-3 font-display text-3xl text-white">
              Panel operativo
            </h2>
          </div>
          <button
            type="button"
            onClick={() => void loadData()}
            className="border border-[color:var(--border-strong)] px-4 py-2 text-sm font-semibold text-white"
          >
            Recargar datos
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <div className="bg-white/10 px-4 py-3 text-sm text-violet-100">
            {statusMessage}
          </div>
          {errorMessage ? (
            <div className="border border-red-300/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <p className="text-sm text-[color:var(--muted)]">
              Cargando productos...
            </p>
          ) : null}

          {!isLoading && products.length === 0 ? (
            <div className="border border-dashed border-[color:var(--border-strong)] px-6 py-8 text-sm text-[color:var(--muted)]">
              No se encontraron productos en el catalogo.
            </div>
          ) : null}

          {products.map((product) => (
            <article
              key={product.id}
              className="border border-[color:var(--border)] bg-white/95 p-5 text-[#210038]"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative h-24 w-full overflow-hidden sm:w-32">
                  <Image
                    src={product.imageUrl}
                    alt={product.nombre}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[#7c3aed]">
                        {product.category?.nombre || "Sin categoria"} · #{product.id}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold">{product.nombre}</h3>
                    </div>
                    <p className="text-lg font-bold text-[#7c3aed]">
                      {formatCurrency(product.precio)}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-[#5b4a68]">
                    {product.descripcion}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="bg-[#7c3aed] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6d28d9]"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(product)}
                      className="border border-red-300 px-4 py-2 text-sm font-semibold text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
