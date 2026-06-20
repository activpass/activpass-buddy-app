import { TRPCError } from '@trpc/server';

import { userRepository } from '@/server/api/routers/user/repository/user.repository';
import { deleteFileFromImageKit } from '@/server/api/utils/imagekit';
import { Logger } from '@/server/logger';

import type { IOrganizationSchema } from '../../organization/model/organization.model';
import type { IUserData } from '../model/user.model';
import type {
  DeleteAvatarArgs,
  GetOnboardingUserArgs,
  GetUserByIdArgs,
  UpdateAvatarArgs,
  UpdateUserArgs,
} from './user.service.types';

class UserService {
  private readonly logger = new Logger(UserService.name);

  getById = async (id: string) => {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with ID ${id} not found`,
      });
    }
    return user.toClientObject();
  };

  getPopulatedUser = async (id: string) => {
    const user = await userRepository.getById(id);
    const populatedDoc = await user.populate('organization');
    return populatedDoc.toClientObject() as unknown as Omit<IUserData, 'organization'> & {
      organization: IOrganizationSchema;
    };
  };

  getUserCacheById = async ({ id }: GetUserByIdArgs) => {
    const user = await userRepository.getUserCacheByIdOrThrow(id);
    return user;
  };

  update = async ({ input }: UpdateUserArgs) => {
    const { id, data } = input;
    try {
      const user = await userRepository.update({ userId: id, data });
      return user.toClientObject();
    } catch (error: unknown) {
      this.logger.error('Failed to update user', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update user',
      });
    }
  };

  getOnboardingUser = async ({ userId }: GetOnboardingUserArgs) => {
    const user = await userRepository.getById(userId);
    return {
      id: user.id,
      email: user.email,
      isOnboardingComplete: user.isOnboardingComplete,
    };
  };

  updateAvatar = async ({ input }: UpdateAvatarArgs) => {
    return userRepository.updateAvatar(input.id, input.avatar);
  };

  deleteAvatar = async ({ input }: DeleteAvatarArgs) => {
    const doc = await userRepository.deleteAvatar(input.id);
    const fileId = doc.avatar?.fileId;
    if (fileId) {
      // delete file from imagekit
      await deleteFileFromImageKit(fileId);
    }
    return {
      data: {
        id: doc.id,
      },
      message: 'Avatar deleted successfully',
    };
  };
}

export const userService = new UserService();
