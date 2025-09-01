import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

import { userService } from './service/user.service';
import { createUserInputSchema, getOnboardingUserInputSchema } from './user.input';

export const userRouter = createTRPCRouter({
  getById: protectedProcedure.query(async ({ ctx }) => {
    return userService.getById({ id: ctx.session.user.id });
  }),
  create: protectedProcedure.input(createUserInputSchema).mutation(async ({ input }) => {
    return userService.create({ input });
  }),
  getOnboardingUser: publicProcedure
    .input(getOnboardingUserInputSchema)
    .query(async ({ input }) => {
      return userService.getOnboardingUser({ userId: input.userId });
    }),
});
