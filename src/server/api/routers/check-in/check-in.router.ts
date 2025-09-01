import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import { checkInService } from './service/check-in.service';

export const checkInRouter = createTRPCRouter({
  generateToken: protectedProcedure.query(async ({ ctx }) => {
    return checkInService.generateToken({
      orgId: ctx.session.user.orgId,
    });
  }),
});
