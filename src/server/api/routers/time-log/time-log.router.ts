import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

import { timeLogService } from './service/time-log.service';
import {
  checkInInputSchema,
  checkInVerifyInputSchema,
  checkOutInputSchema,
  checkOutVerifyInputSchema,
  createTimeLogInputSchema,
  getTimeLogByClientIdWithDateRangeInputSchema,
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
    return timeLogService.list({ ...input, orgId: ctx.session.user.orgId });
  }),
  getTimeLogsByDateRange: protectedProcedure
    .input(getTimeLogByClientIdWithDateRangeInputSchema)
    .query(async ({ input, ctx }) => {
      return timeLogService.getTimeLogsByDateRange({ orgId: ctx.session.user.orgId, input });
    }),
  checkIn: publicProcedure.input(checkInInputSchema).mutation(async ({ input }) => {
    return timeLogService.checkIn({ input });
  }),
  checkInVerify: publicProcedure.input(checkInVerifyInputSchema).mutation(async ({ input }) => {
    return timeLogService.checkInVerify({ input });
  }),
  checkOut: publicProcedure.input(checkOutInputSchema).mutation(async ({ input }) => {
    return timeLogService.checkOut({ input });
  }),
  checkOutVerify: publicProcedure.input(checkOutVerifyInputSchema).mutation(async ({ input }) => {
    return timeLogService.checkOutVerify({ input });
  }),
});
