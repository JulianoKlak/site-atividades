export interface PrivateStorageService {
  getSignedDownloadUrl(key: string): Promise<string>;
}
