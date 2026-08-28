export const metadata = {
  title: "Compra confirmada",
};

export default function ConfirmacaoCompraPage() {
  return (
    <div className="rounded-xl border bg-white p-8">
      <h1 className="text-3xl font-bold">Compra confirmada</h1>
      <p className="mt-2 text-slate-600">Pagamento aprovado. Seus materiais já estão disponíveis em “Minha conta → Meus materiais”.</p>
    </div>
  );
}
