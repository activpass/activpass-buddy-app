import type { RouterOutputs } from '@/trpc/shared';

export type GetPopulatedUserData = RouterOutputs['users']['getPopulatedUser'];

export type UserData = RouterOutputs['users']['getUserCacheById'];
