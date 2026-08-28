import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Atividades Digitais</p>
        <div className="flex gap-4">
          <Link href="/termos">Termos de uso</Link>
          <Link href="/privacidade">Política de privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
