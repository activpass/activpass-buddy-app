import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

import { userService } from './service/user.service';
import {
  deleteAvatarInputSchema,
  getOnboardingUserInputSchema,
  getUserByIdInputSchema,
  updateAvatarInputSchema,
  updateUserInputSchema,
} from './user.input';

export const userRouter = createTRPCRouter({
  getUserCacheById: protectedProcedure.query(async ({ ctx }) => {
    return userService.getUserCacheById({ id: ctx.session.user.id });
  }),
  getById: protectedProcedure.input(getUserByIdInputSchema).query(async ({ input }) => {
    return userService.getById(input.id);
  }),
  getPopulatedUser: protectedProcedure.input(getUserByIdInputSchema).query(async ({ input }) => {
    return userService.getPopulatedUser(input.id);
  }),
  update: protectedProcedure.input(updateUserInputSchema).mutation(async ({ input }) => {
    return userService.update({ input });
  }),
  getOnboardingUser: publicProcedure
    .input(getOnboardingUserInputSchema)
    .query(async ({ input }) => {
      return userService.getOnboardingUser({ userId: input.userId });
    }),
  updateAvatar: protectedProcedure.input(updateAvatarInputSchema).mutation(async ({ input }) => {
    return userService.updateAvatar({
      input,
    });
  }),
  deleteAvatar: protectedProcedure.input(deleteAvatarInputSchema).mutation(async ({ input }) => {
    return userService.deleteAvatar({
      input,
    });
  }),
});
