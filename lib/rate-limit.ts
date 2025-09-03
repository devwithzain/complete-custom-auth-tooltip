const store = new Map<string, { count: number; ts: number }>();

export function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now - entry.ts > windowMs) {
    store.set(key, { count: 1, ts: now });
    return { ok: true, remaining: limit - 1 };
  }
  if (entry.count >= limit) return { ok: false, remaining: 0 };
  entry.count += 1;
  return { ok: true, remaining: limit - entry.count };
}
