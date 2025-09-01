import { Redis } from '@upstash/redis';

import { env } from '@/env';
import { logger } from '@/server/logger';

let cached = global.upstashRedis;

if (!cached) {
  global.upstashRedis = cached;
}

export const upstashRedis = (() => {
  try {
    // For development, return null, Currently, Upstash is not available in development
    if (process.env.NODE_ENV !== 'production') return null;
    if (cached) return cached;
    if (!env.KV_REST_API_URL || !env.KV_REST_API_TOKEN) {
      throw new Error('KV_REST_API_URL and KV_REST_API_TOKEN must be set');
    }
    const instance = new Redis({
      url: env.KV_REST_API_URL,
      token: env.KV_REST_API_TOKEN,
    });

    cached = instance;
    return cached;
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return null;
  }
})();

if (process.env.NODE_ENV !== 'production') global.upstashRedis = upstashRedis;
