import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

import {
  createClientInputSchema,
  deleteAvatarInputSchema,
  getCurrentMembershipPlanInputSchema,
  renewMembershipPlanInputSchema,
  submitOnboardingClientInputSchema,
  updateAvatarInputSchema,
  updateClientInputSchema,
  upgradeMembershipPlanInputSchema,
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
  updateAvatar: protectedProcedure.input(updateAvatarInputSchema).mutation(async ({ input }) => {
    return clientService.updateAvatar({
      input,
    });
  }),
  deleteAvatar: protectedProcedure.input(deleteAvatarInputSchema).mutation(async ({ input }) => {
    return clientService.deleteAvatar({
      input,
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
  upgradeMembershipPlan: protectedProcedure
    .input(upgradeMembershipPlanInputSchema)
    .mutation(async ({ input }) => {
      return clientService.upgradeMembershipPlan({
        input,
      });
    }),
  renewMembershipPlan: protectedProcedure
    .input(renewMembershipPlanInputSchema)
    .mutation(async ({ input }) => {
      return clientService.renewMembershipPlan({ input });
    }),
  getCurrentMembershipPlan: protectedProcedure
    .input(getCurrentMembershipPlanInputSchema)
    .query(({ input }) => {
      return clientService.getCurrentMembershipPlan({
        clientId: input.clientId,
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
    .mutation(async ({ input }) => {
      return clientService.submitOnboardingClient({
        input,
      });
    }),
});
