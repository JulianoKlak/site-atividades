import crypto from "node:crypto";
import type {
  CreatePixChargeInput,
  PaymentService,
  PaymentStatusResult,
  PixCharge,
  WebhookValidationResult,
} from "@/services/payment/types";

export class SandboxPixProvider implements PaymentService {
  async createPixCharge(input: CreatePixChargeInput): Promise<PixCharge> {
    const providerChargeId = `sandbox_${crypto.randomUUID()}`;
    const expiration = new Date(Date.now() + 1000 * 60 * 30);
    const payload = `00020126580014br.gov.bcb.pix0136${providerChargeId}5204000053039865802BR5920Loja Atividades Digitais6009SaoPaulo62070503***6304ABCD`;

    return {
      providerChargeId,
      qrCode: payload,
      copyPasteCode: payload,
      expiresAt: expiration,
      rawResponse: {
        sandbox: true,
        amountCents: input.order.totalCents,
      },
    };
  }

  async getPaymentStatus(providerChargeId: string): Promise<PaymentStatusResult> {
    return {
      providerChargeId,
      status: "PENDING",
      rawResponse: { sandbox: true },
    };
  }

  async validateWebhook(payload: string, signature?: string): Promise<WebhookValidationResult> {
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;
    if (!webhookSecret || !signature) return { valid: false };

    const digest = crypto.createHmac("sha256", webhookSecret).update(payload).digest("hex");
    const valid = crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));

    if (!valid) return { valid: false };

    const data = JSON.parse(payload) as { event?: string };
    return {
      valid: true,
      eventType: data.event,
    };
  }

  async parseWebhook(payload: string): Promise<PaymentStatusResult | null> {
    const data = JSON.parse(payload) as {
      providerChargeId?: string;
      status?: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED";
      paidAt?: string;
    };

    if (!data.providerChargeId || !data.status) return null;

    return {
      providerChargeId: data.providerChargeId,
      status: data.status,
      paidAt: data.paidAt ? new Date(data.paidAt) : undefined,
      rawResponse: data as unknown as Record<string, unknown>,
    };
  }
}
