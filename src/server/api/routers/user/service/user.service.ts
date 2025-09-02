import { TRPCError } from '@trpc/server';

import { userRepository } from '@/server/api/routers/user/repository/user.repository';
import { Logger } from '@/server/logger';

import type {
  CreateUserArgs,
  GetOnboardingUserArgs,
  GetUserByIdArgs,
  UpdateUserArgs,
} from './user.service.types';

class UserService {
  private readonly logger = new Logger(UserService.name);

  getById = async ({ id }: GetUserByIdArgs) => {
    if (!id) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User ID is required',
      });
    }

    const user = await userRepository.getByIdOrThrow(id);
    return user;
  };

  create = async ({ input }: CreateUserArgs) => {
    try {
      const user = await userRepository.create({ data: input });
      return user;
    } catch (error: unknown) {
      this.logger.error('Failed to create user', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create user',
      });
    }
  };

  update = async ({ input }: UpdateUserArgs) => {
    const { id, data } = input;
    try {
      const user = await userRepository.update({ userId: id, data });
      return user;
    } catch (error: unknown) {
      this.logger.error('Failed to update user', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update user',
      });
    }
  };

  getOnboardingUser = async ({ userId }: GetOnboardingUserArgs) => {
    const user = await userRepository.get(userId);
    return {
      id: user.id,
      email: user.email,
      isOnboardingComplete: user.isOnboardingComplete,
    };
  };
}

export const userService = new UserService();
