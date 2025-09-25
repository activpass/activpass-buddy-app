import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  completeOnboardEmployeeInputSchema,
  getOnboardEmployeeByTokenInputSchema,
  sendOnboardingEmailWithOrgDetailsInputSchema,
  verifyOnboardEmployeeTokenInputSchema,
} from './onboard-employee.input';
import { OnboardEmployeeService } from './service/onboard-employee.service';

export const onboardEmployeeRouter = createTRPCRouter({
  // Verify onboarding token (public endpoint for invited employees)
  verify: protectedProcedure
    .input(verifyOnboardEmployeeTokenInputSchema)
    .query(async ({ input }) => {
      return OnboardEmployeeService.verifyToken(input);
    }),

  // Complete employee onboarding
  complete: protectedProcedure
    .input(completeOnboardEmployeeInputSchema)
    .mutation(async ({ input }) => {
      return OnboardEmployeeService.completeOnboarding(input);
    }),

  // Get onboarding by token
  getByToken: protectedProcedure
    .input(getOnboardEmployeeByTokenInputSchema)
    .query(async ({ input }) => {
      return OnboardEmployeeService.getOnboardingByToken(input.token);
    }),

  // Generate onboarding link
  generateOnboardingLink: protectedProcedure.mutation(async ({ ctx }) => {
    return OnboardEmployeeService.generateOnboardingLink(
      ctx.session.user.id,
      ctx.session.user.orgId
    );
  }),

  sendOnboardingLinkThroughEmail: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      return OnboardEmployeeService.sendOnboardingLinkThroughEmail(
        input.email,
        ctx.session.user.id,
        ctx.session.user.orgId
      );
    }),
  sendOnboardingEmailWithOrgDetails: protectedProcedure
    .input(sendOnboardingEmailWithOrgDetailsInputSchema)
    .mutation(async ({ ctx, input: options }) => {
      const { email, customMessage, expirationDays } = options;
      const userId = ctx.session.user.id;
      const { orgId } = ctx.session.user;
      return OnboardEmployeeService.sendOnboardingEmailWithOrgDetails(email, userId, orgId, {
        customMessage,
        expirationDays,
      });
    }),
});
