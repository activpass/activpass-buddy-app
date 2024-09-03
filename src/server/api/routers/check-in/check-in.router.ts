import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

import {
  clientCheckInInputSchema,
  clientCheckInVerifyInputSchema,
  clientCheckOutInputSchema,
  clientCheckOutVerifyInputSchema,
  createCheckInInputSchema,
  listCheckInInputSchema,
  updateCheckInInputSchema,
} from './check-in.input';
import { checkInService } from './service/check-in.service';

export const checkInRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return checkInService.getById({ id: input });
  }),
  create: protectedProcedure.input(createCheckInInputSchema).mutation(async ({ ctx, input }) => {
    return checkInService.create({ input, orgId: ctx.session.user.orgId });
  }),
  update: protectedProcedure.input(updateCheckInInputSchema).mutation(async ({ input }) => {
    return checkInService.update({ input });
  }),
  list: protectedProcedure.input(listCheckInInputSchema).query(async ({ input, ctx }) => {
    return checkInService.list({ orgId: ctx.session.user.orgId, clientId: input.clientId });
  }),
  generateToken: protectedProcedure.query(async ({ ctx }) => {
    return checkInService.generateToken({
      orgId: ctx.session.user.orgId,
    });
  }),
  clientCheckIn: publicProcedure.input(clientCheckInInputSchema).mutation(async ({ input }) => {
    return checkInService.clientCheckIn({ input });
  }),
  clientCheckInVerify: publicProcedure
    .input(clientCheckInVerifyInputSchema)
    .mutation(async ({ input }) => {
      return checkInService.clientCheckInVerify({ input });
    }),
  clientCheckOut: publicProcedure.input(clientCheckOutInputSchema).mutation(async ({ input }) => {
    return checkInService.clientCheckOut({ input });
  }),
  clientCheckOutVerify: publicProcedure
    .input(clientCheckOutVerifyInputSchema)
    .mutation(async ({ input }) => {
      return checkInService.clientCheckOutVerify({ input });
    }),
});
