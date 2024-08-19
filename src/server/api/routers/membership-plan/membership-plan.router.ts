import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  createMembershipPlanInputSchema,
  updateMembershipPlanInputSchema,
} from './membership-plan.input';
import { membershipPlanService } from './service/membership-plan.service';

export const membershipPlanRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return membershipPlanService.getById({ id: input });
  }),
  create: protectedProcedure
    .input(createMembershipPlanInputSchema)
    .mutation(async ({ ctx, input }) => {
      return membershipPlanService.create({ input, orgId: ctx.session.user.orgId });
    }),
  update: protectedProcedure.input(updateMembershipPlanInputSchema).mutation(async ({ input }) => {
    return membershipPlanService.update({ input });
  }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return membershipPlanService.list({ orgId: ctx.session.user.orgId });
  }),
});
