"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciais inválidas.");
      return;
    }

    router.push("/minha-conta");
    router.refresh();
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Entrar</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="E-mail" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Senha" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Entrar</button>
        <Link href="/recuperar-senha" className="block text-center text-sm text-slate-600">
          Esqueci minha senha
        </Link>
      </form>
    </main>
  );
}
