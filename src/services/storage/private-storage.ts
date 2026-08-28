import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { env } from "@/lib/env";
import { StorageService } from "@/services/storage/storage-service";

type StorageTokenPayload = {
  key: string;
  userId: string;
  productId: string;
  exp: number;
};

function sign(data: string) {
  return crypto.createHmac("sha256", env.authSecret).update(data).digest("base64url");
}

export class LocalPrivateStorageService implements StorageService {
  async createTemporaryDownloadToken(params: {
    storageKey: string;
    userId: string;
    productId: string;
    expiresInSeconds: number;
  }): Promise<string> {
    const payload: StorageTokenPayload = {
      key: params.storageKey,
      userId: params.userId,
      productId: params.productId,
      exp: Math.floor(Date.now() / 1000) + params.expiresInSeconds,
    };

    const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = sign(body);
    return `${body}.${signature}`;
  }

  async resolveToken(token: string) {
    const [body, signature] = token.split(".");
    if (!body || !signature || signature !== sign(body)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as StorageTokenPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      storageKey: payload.key,
      userId: payload.userId,
      productId: payload.productId,
    };
  }

  async readPrivateFile(storageKey: string) {
    const fullPath = path.resolve(process.cwd(), env.storageLocalDir, storageKey);
    return fs.readFile(fullPath);
  }
}

export const storageService = new LocalPrivateStorageService();
