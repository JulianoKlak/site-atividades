import Link from "next/link";

const links = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/categorias", label: "Categorias" },
  { href: "/contato", label: "Contato" },
  { href: "/minha-conta", label: "Minha conta" },
];

export function Header() {
  return (
    <header className="border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link className="text-lg font-semibold text-slate-800" href="/">
          Atividades Digitais
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-900">
              {link.label}
            </Link>
          ))}
          <Link href="/carrinho" className="rounded bg-sky-600 px-3 py-1 text-white hover:bg-sky-700">
            Carrinho
          </Link>
        </nav>
      </div>
    </header>
  );
}
