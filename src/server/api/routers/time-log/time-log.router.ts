import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import { timeLogService } from './service/time-log.service';
import {
  createTimeLogInputSchema,
  listTimeLogInputSchema,
  updateTimeLogInputSchema,
} from './time-log.input';

export const timeLogRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return timeLogService.getById({ id: input });
  }),
  create: protectedProcedure.input(createTimeLogInputSchema).mutation(async ({ ctx, input }) => {
    return timeLogService.create({ input, orgId: ctx.session.user.orgId });
  }),
  update: protectedProcedure.input(updateTimeLogInputSchema).mutation(async ({ input }) => {
    return timeLogService.update({ input });
  }),
  list: protectedProcedure.input(listTimeLogInputSchema).query(async ({ input, ctx }) => {
    return timeLogService.list({ orgId: ctx.session.user.orgId, clientId: input.clientId });
  }),
});
