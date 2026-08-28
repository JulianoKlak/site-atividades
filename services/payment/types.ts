import type { Order, OrderItem, Product } from "@prisma/client";

export interface CreatePixChargeInput {
  order: Order & { items: (OrderItem & { product: Product })[] };
  customer: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface PixCharge {
  providerChargeId: string;
  qrCode: string;
  copyPasteCode: string;
  expiresAt: Date;
  rawResponse?: Record<string, unknown>;
}

export interface PaymentStatusResult {
  providerChargeId: string;
  status: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED";
  paidAt?: Date;
  rawResponse?: Record<string, unknown>;
}

export interface WebhookValidationResult {
  valid: boolean;
  eventType?: string;
}

export interface PaymentService {
  createPixCharge(input: CreatePixChargeInput): Promise<PixCharge>;
  getPaymentStatus(providerChargeId: string): Promise<PaymentStatusResult>;
  validateWebhook(payload: string, signature?: string): Promise<WebhookValidationResult>;
  parseWebhook(payload: string): Promise<PaymentStatusResult | null>;
}
