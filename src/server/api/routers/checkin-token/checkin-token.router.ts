import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  createCheckinTokenInputSchema,
  listCheckinTokenInputSchema,
  updateCheckinTokenInputSchema,
} from './checkin-token.input';
import { checkinTokenService } from './service/checkin-token.service';

export const checkinTokenRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return checkinTokenService.getById({ id: input });
  }),
  create: protectedProcedure
    .input(createCheckinTokenInputSchema)
    .mutation(async ({ ctx, input }) => {
      return checkinTokenService.create({ input, orgId: ctx.session.user.orgId });
    }),
  update: protectedProcedure.input(updateCheckinTokenInputSchema).mutation(async ({ input }) => {
    return checkinTokenService.update({ input });
  }),
  list: protectedProcedure.input(listCheckinTokenInputSchema).query(async ({ input, ctx }) => {
    return checkinTokenService.list({ orgId: ctx.session.user.orgId, clientId: input.clientId });
  }),
});
