const requestMap = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entries = requestMap.get(key)?.filter((timestamp) => now - timestamp < windowMs) || [];

  if (entries.length >= limit) {
    return false;
  }

  entries.push(now);
  requestMap.set(key, entries);
  return true;
}
