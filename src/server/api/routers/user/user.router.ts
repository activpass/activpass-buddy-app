import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

import { userService } from './service/user.service';
import { getOnboardingUserInputSchema, updateUserInputSchema } from './user.input';

export const userRouter = createTRPCRouter({
  getUserCacheById: protectedProcedure.query(async ({ ctx }) => {
    return userService.getUserCacheById({ id: ctx.session.user.id });
  }),
  update: protectedProcedure.input(updateUserInputSchema).mutation(async ({ input }) => {
    return userService.update({ input });
  }),
  getOnboardingUser: publicProcedure
    .input(getOnboardingUserInputSchema)
    .query(async ({ input }) => {
      return userService.getOnboardingUser({ userId: input.userId });
    }),
});
