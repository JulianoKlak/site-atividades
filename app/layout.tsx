import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://sala-pronta.example.com"),
  title: {
    default: "SalaPronta | Materiais pedagógicos digitais",
    template: "%s | SalaPronta",
  },
  description: "Loja virtual de apostilas, atividades e materiais pedagógicos digitais em PDF para Ensino Fundamental.",
  openGraph: {
    title: "SalaPronta",
    description: "Materiais pedagógicos digitais para facilitar o dia em sala de aula.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900">
        <SiteHeader />
        <div className="flex min-h-[calc(100vh-160px)] flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
