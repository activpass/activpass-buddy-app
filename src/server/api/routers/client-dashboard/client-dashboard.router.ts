import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

import { getClientDashboardInputSchema } from './client-dashboard.input';
import { clientDashboardService } from './client-dashboard.service';

export const clientDashboardRouter = createTRPCRouter({
  get: publicProcedure.input(getClientDashboardInputSchema).query(async ({ input }) => {
    return clientDashboardService.getDashboardData({
      clientId: input.clientId,
      organizationId: input.organizationId,
    });
  }),
});
