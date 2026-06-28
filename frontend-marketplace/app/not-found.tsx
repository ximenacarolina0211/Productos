import Link from "next/link";

export default function NotFound() {
  return (
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[var(--shadow)]">
      <p className="text-sm uppercase tracking-[0.32em] text-[color:var(--muted)]">
        Recurso no encontrado
      </p>
      <h1 className="mt-4 font-display text-4xl">El producto solicitado no existe.</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
        Verifica el identificador del producto o regresa al catalogo principal
        para continuar navegando.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent)]"
      >
        Ir al catalogo
      </Link>
    </section>
  );
}

