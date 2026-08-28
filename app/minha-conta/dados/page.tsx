import { auth } from "@/auth";

export default async function PersonalDataPage() {
  const session = await auth();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Dados pessoais</h1>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
        <p>Nome: {session?.user?.name ?? "Não informado"}</p>
        <p>E-mail: {session?.user?.email}</p>
      </div>
    </main>
  );
}
