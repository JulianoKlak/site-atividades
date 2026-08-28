import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

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
    <html lang="pt-BR" className={`${nunito.variable} ${nunitoSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900">
        <SiteHeader />
        <div className="flex min-h-[calc(100vh-160px)] flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
