import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  createMembershipPlanInputSchema,
  deleteMembershipPlanInputSchema,
  getMembershipPlanInputSchema,
  updateMembershipPlanInputSchema,
} from './membership-plan.input';
import { membershipPlanService } from './service/membership-plan.service';

export const membershipPlanRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return membershipPlanService.list({ orgId: ctx.session.user.orgId });
  }),
  get: protectedProcedure.input(getMembershipPlanInputSchema).query(async ({ input }) => {
    return membershipPlanService.get({ input });
  }),
  create: protectedProcedure
    .input(createMembershipPlanInputSchema)
    .mutation(async ({ ctx, input }) => {
      return membershipPlanService.create({ input, orgId: ctx.session.user.orgId });
    }),
  update: protectedProcedure.input(updateMembershipPlanInputSchema).mutation(async ({ input }) => {
    return membershipPlanService.update({ input });
  }),
  delete: protectedProcedure.input(deleteMembershipPlanInputSchema).mutation(async ({ input }) => {
    return membershipPlanService.delete({ input });
  }),
});
