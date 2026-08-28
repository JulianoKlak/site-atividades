"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const body = (await response.json()) as { message: string };
    setMessage(body.message);

    if (response.ok) {
      router.push("/login");
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Cadastro</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nome" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="E-mail" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Senha (mín. 8)" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        <button className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Criar conta</button>
      </form>
    </main>
  );
}
