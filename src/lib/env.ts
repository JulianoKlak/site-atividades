const required = ["DATABASE_URL", "AUTH_SECRET", "PAYMENT_API_KEY", "PAYMENT_WEBHOOK_SECRET"] as const;

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[env] Variável ${key} não configurada.`);
  }
}

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  authSecret: process.env.AUTH_SECRET || "dev-secret-change-me",
  paymentApiKey: process.env.PAYMENT_API_KEY || "",
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || "",
  paymentApiBaseUrl: process.env.PAYMENT_API_BASE_URL || "",
  storageProvider: process.env.STORAGE_PROVIDER || "local",
  storageLocalDir: process.env.STORAGE_LOCAL_DIR || "private/pdfs",
  emailApiUrl: process.env.EMAIL_API_URL || "",
  emailApiKey: process.env.EMAIL_API_KEY || "",
};
