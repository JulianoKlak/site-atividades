export type PixCharge = {
  chargeId: string;
  qrCodeImage: string;
  copyPasteCode: string;
  expiresAt?: string;
  raw: unknown;
};

export type PaymentLookup = {
  chargeId: string;
  status: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED";
  paidAt?: string;
  raw: unknown;
};

export type WebhookResult = {
  chargeId: string;
  status: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED";
  paidAt?: string;
  payload: unknown;
};

export interface PaymentService {
  createPixCharge(params: {
    orderId: string;
    amountInCents: number;
    customer: { name: string; email: string };
  }): Promise<PixCharge>;
  getPaymentStatus(chargeId: string): Promise<PaymentLookup>;
  validateWebhookSignature(rawBody: string, signature: string | null): boolean;
  processWebhook(rawBody: string): Promise<WebhookResult>;
}
