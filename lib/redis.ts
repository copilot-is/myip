import Redis from 'ioredis';

const url = process.env.REDIS_URL;
if (!url || url.trim() === '') {
  throw new Error('REDIS_URL is required and cannot be empty');
}

const redis = new Redis(url);

redis.on('error', err => {
  console.error('[redis] error:', err);
});

redis.on('connect', () => {
  console.log('[redis] Connected to Redis');
});

redis.on('reconnecting', (delay: number) => {
  console.log(`[redis] Reconnecting in ${delay}ms`);
});

redis.on('ready', () => {
  console.log('[redis] Connection ready');
});

redis.on('end', () => {
  console.log('[redis] Connection ended');
});

export default redis;
