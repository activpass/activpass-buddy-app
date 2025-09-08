import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import { createOrganizationInputSchema, updateOrganizationInputSchema } from './organization.input';
import { organizationService } from './service/organization.service';

export const organizationRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return organizationService.getById({ id: input });
  }),
  create: protectedProcedure.input(createOrganizationInputSchema).mutation(async ({ input }) => {
    return organizationService.create({ input });
  }),
  update: protectedProcedure.input(updateOrganizationInputSchema).mutation(async ({ input }) => {
    return organizationService.update({ input });
  }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return organizationService.list({ userId: ctx.session.user.id });
  }),
});
