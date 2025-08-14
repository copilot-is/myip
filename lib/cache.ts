import redis from '@/lib/redis';

type Wrapped<T> = T & { updatedAt: number };

// 7 days
export const DEFAULT_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

export async function getJSON<T>(key: string): Promise<T | undefined> {
  const v = await redis.get(key);
  if (!v) return;
  try {
    return JSON.parse(v) as T;
  } catch {
    return;
  }
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  const current = await redis.get(key);
  if (current) {
    const parsed = JSON.parse(current) as Wrapped<T>;
    if (Date.now() - parsed.updatedAt >= DEFAULT_EXPIRES_MS) {
      await redis.set(key, JSON.stringify(value));
    }
  } else {
    await redis.set(key, JSON.stringify(value));
  }
}
