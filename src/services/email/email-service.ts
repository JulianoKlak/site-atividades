import { env } from "@/lib/env";

export async function sendOrderPaidEmail(params: { to: string; orderId: string }) {
  if (!env.emailApiUrl || !env.emailApiKey) {
    console.info(`Pedido ${params.orderId} pago para ${params.to}. Configure EMAIL_API_URL para envio real.`);
    return;
  }

  await fetch(env.emailApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `******
    },
    body: JSON.stringify({
      to: params.to,
      subject: "Pagamento confirmado",
      html: `<p>Seu pedido ${params.orderId} foi confirmado e os materiais já estão disponíveis na sua conta.</p>`,
    }),
  });
}
