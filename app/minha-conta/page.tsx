import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Minha conta</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link className="rounded-xl border border-slate-200 bg-white p-5" href="/minha-conta/pedidos">Meus pedidos</Link>
        <Link className="rounded-xl border border-slate-200 bg-white p-5" href="/minha-conta/materiais">Meus materiais</Link>
        <Link className="rounded-xl border border-slate-200 bg-white p-5" href="/minha-conta/dados">Dados pessoais</Link>
      </div>
    </main>
  );
}
