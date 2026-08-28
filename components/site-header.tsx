import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-slate-800">
          SalaPronta
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-700">
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/categorias">Categorias</Link>
          <Link href="/minha-conta">Minha conta</Link>
          <Link href="/carrinho">Carrinho</Link>
          <Link href="/login">Entrar</Link>
        </nav>
      </div>
    </header>
  );
}
