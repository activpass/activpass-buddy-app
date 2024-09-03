import type { RouterOutputs } from '@/trpc/shared';

export type ClientData = RouterOutputs['clients']['list'][number];
