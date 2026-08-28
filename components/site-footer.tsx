import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-sm text-slate-600 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} SalaPronta. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <Link href="/termos-de-uso">Termos de uso</Link>
          <Link href="/politica-de-privacidade">Política de privacidade</Link>
          <Link href="/contato">Contato</Link>
        </div>
      </div>
    </footer>
  );
}
