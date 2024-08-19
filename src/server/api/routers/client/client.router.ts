import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import { createClientInputSchema, updateClientInputSchema } from './client.input';
import { clientService } from './service/client.service';

export const clientRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return clientService.getById({ id: input });
  }),
  create: protectedProcedure.input(createClientInputSchema).mutation(async ({ ctx, input }) => {
    return clientService.create({
      input,
      orgId: ctx.session.user.orgId,
    });
  }),
  update: protectedProcedure.input(updateClientInputSchema).mutation(async ({ input, ctx }) => {
    return clientService.update({
      input,
      orgId: ctx.session.user.orgId,
    });
  }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return clientService.list({
      orgId: ctx.session.user.orgId,
    });
  }),
  analytics: protectedProcedure.query(async ({ ctx }) => {
    return clientService.analytics({
      orgId: ctx.session.user.orgId,
    });
  }),
});
