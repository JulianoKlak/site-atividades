export const metadata = {
  title: "Checkout PIX",
};

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="text-slate-600">Informe seus dados e finalize o pedido com cobrança PIX.</p>
      <div className="rounded-xl border bg-white p-4">
        <p className="text-sm">Faça requisição POST para <code>/api/checkout</code> enviando produtos, e-mail, nome e cupom.</p>
      </div>
    </div>
  );
}
