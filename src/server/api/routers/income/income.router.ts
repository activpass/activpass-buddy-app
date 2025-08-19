import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  createIncomeInputSchema,
  getByIdInputSchema,
  listIncomeInputSchema,
  updateIncomeInputSchema,
} from './income.input';
import { incomeService } from './service/income.service';

export const incomeRouter = createTRPCRouter({
  getById: protectedProcedure.input(getByIdInputSchema).query(async ({ input }) => {
    return incomeService.getById({ input });
  }),
  getPopulatedById: protectedProcedure.input(getByIdInputSchema).query(async ({ input }) => {
    return incomeService.getPopulatedById({ input });
  }),
  create: protectedProcedure.input(createIncomeInputSchema).mutation(async ({ ctx, input }) => {
    return incomeService.create({ input, orgId: ctx.session.user.orgId });
  }),
  update: protectedProcedure.input(updateIncomeInputSchema).mutation(async ({ input }) => {
    return incomeService.update({ input });
  }),
  list: protectedProcedure.input(listIncomeInputSchema).query(async ({ input, ctx }) => {
    return incomeService.list({ orgId: ctx.session.user.orgId, clientId: input.clientId });
  }),
});
