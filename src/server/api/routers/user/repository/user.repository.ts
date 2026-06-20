import { TRPCError } from '@trpc/server';
import { addDays } from 'date-fns';
import { z } from 'zod';

import { generateRandomToken } from '@/server/api/helpers/common';
import { type ServerSession } from '@/server/api/routers/auth/service/auth.service.types';
import {
  type ChangePasswordParams,
  type CreateUserParams,
  type ForgotPasswordParams,
  type GetUserByIdOptions,
  type ResetPasswordParams,
  type UpdateUserParams,
} from '@/server/api/routers/user/repository/user.repository.types';
import { getTRPCError } from '@/server/api/utils/trpc-error';
import { Logger } from '@/server/logger/logger';

import { organizationRepository } from '../../organization/repository/organization.repository';
import { cacheUserInfo, clearCachedUserInfo, getCachedUserInfo } from '../helper/user.helper';
import {
  type IUserBaseSchema,
  type IUserData,
  type IUserSchema,
  UserModel,
} from '../model/user.model';

class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  getById = async (id: string) => {
    const user = await UserModel.get(id);
    return user;
  };

  getUserCacheById = async <T extends boolean = false>(
    id: IUserData['id'],
    options?: GetUserByIdOptions<T>
  ): Promise<(T extends true ? ServerSession['user'] : IUserData) | null> => {
    const { includeSensitiveInfo = false, bypassCache = false } = options ?? {};
    if (!bypassCache) {
      const cachedUserInfo = await getCachedUserInfo(id);
      if (cachedUserInfo) {
        if (includeSensitiveInfo) return cachedUserInfo;

        delete cachedUserInfo.hash;
        delete cachedUserInfo.salt;

        return cachedUserInfo satisfies IUserData as T extends true
          ? ServerSession['user']
          : IUserData;
      }
    }

    let userData: ServerSession['user'] | null = null;

    try {
      const userDoc = await UserModel.get(id);
      userData = userDoc.toClientObject(includeSensitiveInfo);
    } catch (error) {
      this.logger.error('Failed to get user by id', error);
    }

    if (userData) {
      await cacheUserInfo(userData);
    }

    return userData ?? null;
  };

  getUserCacheByIdOrThrow = async <T extends boolean = false>(
    id: IUserSchema['id'],
    options?: GetUserByIdOptions<T>
  ): Promise<T extends true ? ServerSession['user'] : IUserData> => {
    const user = await this.getUserCacheById(id, options);
    if (user === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User not found with id: ${id}`,
      });
    }
    return user;
  };

  getByEmail = async (email: string) => {
    return UserModel.findByEmail(email);
  };

  isUserExists = async (email: string) => {
    try {
      let user: IUserSchema | null = null;

      try {
        user = await this.getByEmail(email);
      } catch {
        user = null; // User does not exist, which is expected
      }

      if (user) {
        const userEmail = user.email;
        const isEmail = z.string().email().safeParse(userEmail).success;

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `${isEmail ? 'User with email ' : 'Username '}"${userEmail}" already exist."`,
        });
      }
    } catch (error) {
      this.logger.error('Failed to check if user exists', error);
      throw error;
    }
  };

  authenticate = async (email: string, password: string) => {
    try {
      const user = await UserModel.authenticate(email, password);
      user.set('lastLogin', new Date());
      const savedUser = await user.save();
      await clearCachedUserInfo(user.id);
      return savedUser;
    } catch (error) {
      this.logger.error('Failed to authenticate user', error);
      throw error;
    }
  };

  create = async ({ data }: CreateUserParams) => {
    try {
      await this.isUserExists(data.email);

      const user = new UserModel(data);
      await user.save();

      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw error;
    }
  };

  update = async ({ userId, data }: UpdateUserParams) => {
    try {
      const { organization, ...restData } = data; // Exclude 'organization' from being directly updated

      if (organization) {
        const { id: orgId, ...restOrg } = organization;

        if (!orgId) {
          throw getTRPCError(
            'Organization ID is required to update organization details',
            'BAD_REQUEST'
          );
        }

        // Update organization details using organizationRepository
        await clearCachedUserInfo(userId);
        await organizationRepository.update({
          id: orgId,
          data: restOrg,
        });
      }

      const updatedUser = await UserModel.findByIdAndUpdate(userId, restData, { new: true }).exec();
      if (!updatedUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      await cacheUserInfo(updatedUser.toClientObject());
      return updatedUser;
    } catch (error) {
      this.logger.error('Failed to update user', error);
      throw error;
    }
  };

  forgotPassword = async ({ email }: ForgotPasswordParams) => {
    const user = await UserModel.findByEmail(email);

    const token = generateRandomToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = addDays(new Date(), 1);

    try {
      return await user.save();
    } catch (error) {
      this.logger.error('Failed to save reset password token', error);
      throw error;
    }
  };

  resetPassword = async (params: ResetPasswordParams) => {
    const { email, passwordToken, password } = params;

    await UserModel.findByEmail(email);

    const user = await UserModel.findOne({
      resetPasswordToken: passwordToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    }).exec();

    if (!user) {
      throw new Error('Password reset token is invalid or has expired.');
    }

    user.set('password', password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    try {
      return await user.save();
    } catch (error) {
      this.logger.error('Failed to save reset password token', error);
      throw error;
    }
  };

  changePassword = async ({ userId, oldPassword, newPassword }: ChangePasswordParams) => {
    return UserModel.changePassword(userId, oldPassword, newPassword);
  };

  updateAvatar = async (id: string, avatar: IUserBaseSchema['avatar']) => {
    try {
      const updatedDoc = await UserModel.findByIdAndUpdate(
        id,
        {
          avatar,
        },
        { new: true }
      ).exec();
      if (!updatedDoc) {
        throw getTRPCError('User not found', 'NOT_FOUND');
      }
      return updatedDoc;
    } catch (error) {
      this.logger.error('Failed to update user avatar', error);
      throw error;
    }
  };

  deleteAvatar = async (id: string) => {
    try {
      const updatedDoc = await UserModel.findByIdAndUpdate(
        id,
        {
          avatar: null,
        },
        { new: false }
      ).exec();
      if (!updatedDoc) {
        throw getTRPCError('User not found', 'NOT_FOUND');
      }
      return updatedDoc;
    } catch (error) {
      this.logger.error('Failed to delete user avatar', error);
      throw error;
    }
  };
}

export const userRepository = new UserRepository();
