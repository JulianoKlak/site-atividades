export const metadata = {
  title: "Carrinho",
};

export default function CarrinhoPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Carrinho</h1>
      <p className="text-slate-600">Adicione produtos no catálogo e finalize no checkout.</p>
      <p className="rounded-xl border bg-white p-4 text-sm">A validação de preços e cálculo final é feita no backend no endpoint /api/checkout.</p>
    </div>
  );
}
