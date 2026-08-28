export interface StorageService {
  createTemporaryDownloadToken(params: {
    storageKey: string;
    userId: string;
    productId: string;
    expiresInSeconds: number;
  }): Promise<string>;
  resolveToken(token: string): Promise<{ storageKey: string; userId: string; productId: string } | null>;
  readPrivateFile(storageKey: string): Promise<Buffer>;
}
