import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

import { timeLogService } from './service/time-log.service';
import {
  clientCheckInInputSchema,
  clientCheckInVerifyInputSchema,
  clientCheckOutInputSchema,
  clientCheckOutVerifyInputSchema,
  createTimeLogInputSchema,
  getTimeLogByClientIdWithDateRangeInputSchema,
  listTimeLogInputSchema,
  updateTimeLogInputSchema,
} from './time-log.input';

export const timeLogRouter = createTRPCRouter({
  getUserCacheById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return timeLogService.getUserCacheById({ id: input });
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
  getByClientIdWithDateRange: protectedProcedure
    .input(getTimeLogByClientIdWithDateRangeInputSchema)
    .query(async ({ input, ctx }) => {
      return timeLogService.getByClientIdWithDateRange({ orgId: ctx.session.user.orgId, input });
    }),
  clientCheckIn: publicProcedure.input(clientCheckInInputSchema).mutation(async ({ input }) => {
    return timeLogService.clientCheckIn({ input });
  }),
  clientCheckInVerify: publicProcedure
    .input(clientCheckInVerifyInputSchema)
    .mutation(async ({ input }) => {
      return timeLogService.clientCheckInVerify({ input });
    }),
  clientCheckOut: publicProcedure.input(clientCheckOutInputSchema).mutation(async ({ input }) => {
    return timeLogService.clientCheckOut({ input });
  }),
  clientCheckOutVerify: publicProcedure
    .input(clientCheckOutVerifyInputSchema)
    .mutation(async ({ input }) => {
      return timeLogService.clientCheckOutVerify({ input });
    }),
});
