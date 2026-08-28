const windowMs = 60_000;
const maxPerWindow = 20;
const requests = new Map<string, { count: number; expiresAt: number }>();

export const checkRateLimit = (key: string) => {
  const now = Date.now();
  const current = requests.get(key);

  if (!current || current.expiresAt <= now) {
    requests.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (current.count >= maxPerWindow) return false;
  current.count += 1;
  requests.set(key, current);
  return true;
};
