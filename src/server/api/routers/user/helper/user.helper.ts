import { redis } from '@/server/database/redis';

import type { ServerSession } from '../../auth/service/auth.service.types';

export const getUserInfoKey = (userId: string): string => {
  return `user-info:${userId}`;
};

export const cacheUserInfo = async (user: ServerSession['user']): Promise<void> => {
  const userKey = getUserInfoKey(user.id);
  await redis.set(
    userKey,
    JSON.stringify(user),
    'EX',
    60 * 60 * 24 * 2 // 2 days in seconds
  );
};

export const clearCachedUserInfo = async (userId: ServerSession['user']['id']): Promise<void> => {
  const userKey = getUserInfoKey(userId);
  await redis.del(userKey);
};

export const getCachedUserInfo = async (
  userId: ServerSession['user']['id']
): Promise<ServerSession['user'] | null> => {
  const userKey = getUserInfoKey(userId);
  const cachedUserInfo = await redis.get(userKey);
  return cachedUserInfo !== null ? (JSON.parse(cachedUserInfo) as ServerSession['user']) : null;
};
