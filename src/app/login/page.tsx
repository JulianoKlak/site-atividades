export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold">Entrar</h1>
      <form className="mt-4 space-y-3" action="/api/auth/login" method="post">
        <input name="email" type="email" placeholder="E-mail" className="w-full rounded border p-2" required />
        <input name="password" type="password" placeholder="Senha" className="w-full rounded border p-2" required />
        <button className="w-full rounded bg-sky-600 py-2 font-semibold text-white">Entrar</button>
      </form>
    </div>
  );
}
