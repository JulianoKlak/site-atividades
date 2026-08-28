import crypto from "node:crypto";
import { env } from "@/lib/env";
import { PaymentService, PixCharge, PaymentLookup, WebhookResult } from "@/services/payment/payment-service";

type GatewayCreateResponse = {
  id: string;
  qrCodeImage: string;
  copyPasteCode: string;
  status: string;
  paidAt?: string;
  expiresAt?: string;
};

function normalizeStatus(status: string): "PENDING" | "PAID" | "CANCELLED" | "EXPIRED" {
  switch (status.toUpperCase()) {
    case "PAID":
    case "COMPLETED":
      return "PAID";
    case "CANCELLED":
      return "CANCELLED";
    case "EXPIRED":
      return "EXPIRED";
    default:
      return "PENDING";
  }
}

export class PixHttpPaymentService implements PaymentService {
  private headers() {
    return {
      "Content-Type": "application/json",
      Authorization: `******
    };
  }

  async createPixCharge(params: {
    orderId: string;
    amountInCents: number;
    customer: { name: string; email: string };
  }): Promise<PixCharge> {
    if (!env.paymentApiBaseUrl) {
      throw new Error("PAYMENT_API_BASE_URL não configurada");
    }

    const response = await fetch(`${env.paymentApiBaseUrl}/charges`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        amountInCents: params.amountInCents,
        externalReference: params.orderId,
        customer: params.customer,
        paymentMethod: "PIX",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Falha ao criar cobrança PIX: ${response.status}`);
    }

    const data = (await response.json()) as GatewayCreateResponse;

    return {
      chargeId: data.id,
      qrCodeImage: data.qrCodeImage,
      copyPasteCode: data.copyPasteCode,
      expiresAt: data.expiresAt,
      raw: data,
    };
  }

  async getPaymentStatus(chargeId: string): Promise<PaymentLookup> {
    if (!env.paymentApiBaseUrl) {
      throw new Error("PAYMENT_API_BASE_URL não configurada");
    }

    const response = await fetch(`${env.paymentApiBaseUrl}/charges/${chargeId}`, {
      method: "GET",
      headers: this.headers(),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Falha ao consultar cobrança: ${response.status}`);
    }

    const data = (await response.json()) as GatewayCreateResponse;

    return {
      chargeId: data.id,
      status: normalizeStatus(data.status),
      paidAt: data.paidAt,
      raw: data,
    };
  }

  validateWebhookSignature(rawBody: string, signature: string | null): boolean {
    if (!signature) return false;
    const digest = crypto.createHmac("sha256", env.paymentWebhookSecret).update(rawBody).digest("hex");
    const digestBuffer = Buffer.from(digest);
    const signatureBuffer = Buffer.from(signature);
    if (digestBuffer.length !== signatureBuffer.length) return false;
    return crypto.timingSafeEqual(digestBuffer, signatureBuffer);
  }

  async processWebhook(rawBody: string): Promise<WebhookResult> {
    const payload = JSON.parse(rawBody) as {
      id: string;
      status: string;
      paidAt?: string;
    };

    return {
      chargeId: payload.id,
      status: normalizeStatus(payload.status),
      paidAt: payload.paidAt,
      payload,
    };
  }
}
