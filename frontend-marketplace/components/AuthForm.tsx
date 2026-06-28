"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getDefaultRouteForRole } from "@/lib/auth-constants";
import { AuthenticatedUser } from "@/types/auth";

type AuthFormProps = {
  mode: "login" | "register";
};

type AuthResponse = {
  user: AuthenticatedUser;
};

async function readMessage(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || "La solicitud no pudo completarse.";
  } catch {
    return "La solicitud no pudo completarse.";
  }
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (isRegister && password !== confirmPassword) {
      setErrorMessage("Las contrasenas no coinciden.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(await readMessage(response));
      }

      const data = (await response.json()) as AuthResponse;
      router.push(getDefaultRouteForRole(data.user.role));
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible iniciar sesion.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-5xl overflow-hidden border border-[color:var(--border)] bg-[#1e0032]/85 shadow-[var(--shadow)] lg:grid-cols-[0.85fr_1.15fr]">
      <div className="bg-[linear-gradient(145deg,rgba(124,58,237,0.95),rgba(88,28,135,0.86))] p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.32em] text-violet-200">
          Acceso comercial
        </p>
        <h1 className="mt-5 font-display text-5xl leading-[1.02] text-white">
          {isRegister ? "Abre tu cuenta." : "Entra a tu tienda."}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-violet-100">
          {isRegister
            ? "Crea tu acceso y empieza a navegar el catalogo."
            : "Administra compras, productos y categorias desde un solo lugar."}
        </p>

        <div className="mt-8 border border-white/15 bg-white/10 p-5 text-sm leading-7 text-violet-100">
          <p className="font-semibold text-white">Accesos demo</p>
          <p className="mt-2">Admin: admin@marketplace.test / Admin123*</p>
          <p>Cliente: cliente@marketplace.test / Cliente123*</p>
        </div>
      </div>

      <div className="p-8 sm:p-10">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister ? (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">
                Nombre
              </span>
              <input
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                className="w-full border border-[color:var(--border-strong)] bg-white/95 px-4 py-3 text-[#210038] outline-none transition focus:border-[color:var(--accent)]"
                placeholder="Tu nombre completo"
                required
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white">
              Correo
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-[color:var(--border-strong)] bg-white/95 px-4 py-3 text-[#210038] outline-none transition focus:border-[color:var(--accent)]"
              placeholder="correo@ejemplo.com"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white">
              Contrasena
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-[color:var(--border-strong)] bg-white/95 px-4 py-3 text-[#210038] outline-none transition focus:border-[color:var(--accent)]"
              placeholder="Minimo 6 caracteres"
              required
            />
          </label>

          {isRegister ? (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">
                Confirmar contrasena
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full border border-[color:var(--border-strong)] bg-white/95 px-4 py-3 text-[#210038] outline-none transition focus:border-[color:var(--accent)]"
                placeholder="Repite tu contrasena"
                required
              />
            </label>
          ) : null}

          {errorMessage ? (
            <div className="border border-red-300/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Procesando..."
              : isRegister
                ? "Crear cuenta"
                : "Iniciar sesion"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[color:var(--muted)]">
          {isRegister ? "Ya tienes cuenta?" : "Aun no tienes cuenta?"}{" "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="font-semibold text-violet-200"
          >
            {isRegister ? "Inicia sesion" : "Registrate aqui"}
          </Link>
        </p>
      </div>
    </section>
  );
}
