import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getSessionUser } from "@/lib/session";

export default async function Navbar() {
  const session = await getSessionUser();
  const role = session?.user.role;

  const links = session
    ? [
        { href: "/", label: "Tienda" },
        ...(role === "ADMIN"
          ? [{ href: "/admin", label: "Panel" }]
          : []),
      ]
    : [
        { href: "/login", label: "Ingresar" },
        { href: "/register", label: "Registro" },
      ];

  return (
    <header className="sticky top-0 z-20 pt-4">
      <nav className="flex flex-col gap-4 border border-[color:var(--border)] bg-[#1e0032]/90 px-4 py-4 shadow-[var(--shadow)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <Link href={session ? "/" : "/login"} className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-[color:var(--accent)] text-sm font-bold text-white">
            PV
          </span>
          <div>
            <p className="font-display text-lg leading-none text-white">
              Productos Violet
            </p>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Retail
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[color:var(--muted)] transition hover:bg-[color:var(--accent-soft)] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {session ? (
            <div className="flex items-center gap-3">
              <div className="bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">
                {session.user.role}
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{session.user.nombre}</p>
                <p className="text-xs text-[color:var(--muted)]">
                  {session.user.email}
                </p>
              </div>
              <LogoutButton />
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
