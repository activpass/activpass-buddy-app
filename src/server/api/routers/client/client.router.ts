import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

import {
  createClientInputSchema,
  submitOnboardingClientInputSchema,
  updateClientInputSchema,
  verifyOnboardingTokenInputSchema,
} from './client.input';
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
  generateOnboardingLink: protectedProcedure.mutation(async ({ ctx }) => {
    return clientService.generateOnboardingLink({
      orgId: ctx.session.user.orgId,
      userId: ctx.session.user.id,
    });
  }),
  verifyOnboardingToken: publicProcedure
    .input(verifyOnboardingTokenInputSchema)
    .mutation(async ({ input }) => {
      return clientService.verifyOnboardingToken({
        token: input.token,
      });
    }),
  submitOnboardingClient: publicProcedure
    .input(submitOnboardingClientInputSchema)
    .mutation(({ input }) => {
      const { orgId, ...restInput } = input;
      return clientService.create({
        orgId,
        input: restInput,
      });
    }),
});
