import Redis from 'ioredis';

const url = process.env.REDIS_URL;
if (!url || url.trim() === '') {
  throw new Error('REDIS_URL is required and cannot be empty');
}

const redis = new Redis(url);

redis.on('error', err => {
  console.error('[redis] error:', err);
});

export default redis;
