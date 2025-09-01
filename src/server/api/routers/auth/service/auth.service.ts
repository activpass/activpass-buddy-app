import { TRPCError } from '@trpc/server';
import type { Session } from 'next-auth';

import { TimeInSeconds } from '@/server/api/enums/time-in-seconds.enum';
import { getHashToken } from '@/server/api/helpers/common';
import { type IUserData, UserModel } from '@/server/api/routers/user/model/user.model';
import { userRepository } from '@/server/api/routers/user/repository/user.repository';
import { createSecureCookie, deleteCookie } from '@/server/api/utils/cookie-management';
import { getTRPCError } from '@/server/api/utils/trpc-error';
import { redis } from '@/server/database/redis';
import { Logger } from '@/server/logger';

import { OrganizationModel } from '../../organization/model/organization.model';
import {
  AUTH_ROLES,
  SESSION_TOKEN_COOKIE_KEY,
  SESSION_TOKENS_PREFIX,
  USER_ID_COOKIE_KEY,
} from '../constants';
import {
  type AccountVerifyArgs,
  type AddUserSessionArgs,
  type CreateOnboardingStepArgs,
  type DeleteSessionTokenArgs,
  type ForgotPasswordArgs,
  type ResetPasswordArgs,
  type ServerSession,
  type SignInArgs,
  type SignOutAllSessionsArgs,
  type SignOutArgs,
  type SignUpArgs,
  type ValidateSessionTokenArgs,
  type ValidateSessionTokenResult,
} from './auth.service.types';

class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /** @deprecated */
  getSessionTokensKey = (userId: IUserData['id']): string => {
    return `${SESSION_TOKENS_PREFIX}${userId}`;
  };

  /** @deprecated */
  private async addUserSession(args: AddUserSessionArgs): Promise<void> {
    const sessionKey = this.getSessionTokensKey(args.userId);
    const score = Math.floor(Date.now() / 1000) + args.expiresIn; // Current time + expiration time in seconds

    const pipeline = redis.multi();
    pipeline.zadd(sessionKey, score.toString(), args.sessionToken);
    pipeline.zcount(sessionKey, '-inf', '+inf');
    pipeline.expire(sessionKey, args.expiresIn);

    const results = await pipeline.exec();
    const sessionTokensCount = results?.[1]?.[1];
    if (
      !Array.isArray(results) ||
      results.some(result => result[0] !== null) ||
      typeof sessionTokensCount !== 'number'
    ) {
      // TODO: Logging
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to add user session',
      });
    }

    const SESSIONS_TOKEN_LIMIT = 8;
    if (sessionTokensCount > SESSIONS_TOKEN_LIMIT) {
      const tokensToRemove = sessionTokensCount - 8;
      pipeline.zremrangebyrank(sessionKey, 0, tokensToRemove - 1);
    }

    await pipeline.exec();
  }

  /** @deprecated */
  private async deleteSessionToken(args: DeleteSessionTokenArgs): Promise<void> {
    const sessionKey = this.getSessionTokensKey(args.userId);
    await redis.zrem(sessionKey, args.sessionToken);
  }

  /** @deprecated */
  private async isTokenAboutToExpire(
    userId: IUserData['id'],
    decodedSessionToken: string
  ): Promise<boolean> {
    const sessionKey = this.getSessionTokensKey(userId);
    const score = await redis.zscore(sessionKey, decodedSessionToken);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return score !== null && parseInt(score, 10) - currentTimestamp < TimeInSeconds.OneWeek;
  }

  private generateSessionToken(userId: IUserData['id']): string {
    const rawToken = `${userId}-${Date.now()}-${Math.random()}`;
    const hashedToken = getHashToken(rawToken);
    return hashedToken;
  }

  /** @deprecated */
  private async renewSessionTokenAndCookies(
    userId: IUserData['id'],
    headers: Headers
  ): Promise<string> {
    const expiresIn = 60 * 60 * 24 * 5; // Renew for another 5 days
    const newSessionToken = this.generateSessionToken(userId);
    await this.addUserSession({
      userId,
      sessionToken: newSessionToken,
      expiresIn,
    });

    createSecureCookie({
      headers,
      expiresInSeconds: expiresIn,
      name: SESSION_TOKEN_COOKIE_KEY,
      value: encodeURIComponent(newSessionToken),
    });

    return newSessionToken;
  }

  /** @deprecated */
  verifySessionTokenFromCookies = (headers: Headers) => {
    const sessionToken = headers
      .get('cookie')
      ?.split(';')
      .find(cookie => {
        return cookie.trim().startsWith(SESSION_TOKEN_COOKIE_KEY);
      });

    const userId = headers
      .get('cookie')
      ?.split(';')
      .find(cookie => {
        return cookie.trim().startsWith(USER_ID_COOKIE_KEY);
      });

    if (!sessionToken || !userId) return null;

    const encodedSessionToken = sessionToken.split('=')[1];
    const userIdValue = userId.split('=')[1];

    if (!encodedSessionToken || !userIdValue) return null;

    return {
      encodedSessionToken,
      userId: userIdValue,
    };
  };

  /** @deprecated */
  checkSessionTokenValidity = async (
    userId: IUserData['id'],
    sessionToken: string
  ): Promise<boolean> => {
    const sessionKey = this.getSessionTokensKey(userId);
    const score = await redis.zscore(sessionKey, sessionToken);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (score !== null && parseInt(score, 10) > currentTimestamp) {
      return true;
    }

    await redis.zrem(sessionKey, sessionToken);
    return false;
  };

  /** @deprecated */
  createUserSession = async (user: IUserData, headers: Headers) => {
    const expiresIn = TimeInSeconds.TwoWeeks;
    const sessionToken = this.generateSessionToken(user.id);
    await this.addUserSession({
      userId: user.id,
      sessionToken,
      expiresIn,
    });

    createSecureCookie({
      headers,
      expiresInSeconds: expiresIn,
      name: SESSION_TOKEN_COOKIE_KEY,
      value: encodeURIComponent(sessionToken),
    });

    createSecureCookie({
      headers,
      expiresInSeconds: expiresIn,
      name: USER_ID_COOKIE_KEY,
      value: user.id,
    });

    return {
      user,
      sessionToken,
    };
  };

  /** @deprecated */
  signIn = async (args: SignInArgs): Promise<ServerSession> => {
    const { input, headers } = args;
    try {
      const verifiedUser = await userRepository.authenticate(input.email, input.password);
      const user = verifiedUser.toClientObject();
      return await this.createUserSession(user, headers);
    } catch (error: unknown) {
      throw getTRPCError(error);
    }
  };

  signUp = async (args: SignUpArgs) => {
    const { input } = args;
    const data = {
      ...input,
      role: AUTH_ROLES.OWNER,
      isOnboardingComplete: false,
    };
    const newUser = await userRepository.create({ data });

    if (!newUser) {
      throw getTRPCError('Failed to create user');
    }

    return newUser.toClientObject();
  };

  /** @deprecated */
  signOut = async (args: SignOutArgs): Promise<void> => {
    await this.deleteSessionToken({
      userId: args.session.user.id,
      sessionToken: args.session.sessionToken,
    });

    this.logger.info('User signed out successfully: ', args.session.user.id);

    deleteCookie({
      headers: args.headers,
      name: SESSION_TOKEN_COOKIE_KEY,
    });

    deleteCookie({
      headers: args.headers,
      name: USER_ID_COOKIE_KEY,
    });
  };

  /** @deprecated */
  validateSessionToken = async (
    args: ValidateSessionTokenArgs
  ): Promise<ValidateSessionTokenResult> => {
    const decodedSessionToken = decodeURIComponent(args.encodedSessionToken);
    const isSessionTokenValid = await this.checkSessionTokenValidity(
      args.userId,
      decodedSessionToken
    );

    if (!isSessionTokenValid) {
      return {
        success: false,
      };
    }

    let finalSessionToken = decodedSessionToken;
    if (await this.isTokenAboutToExpire(args.userId, decodedSessionToken)) {
      finalSessionToken = await this.renewSessionTokenAndCookies(args.userId, args.headers);
    }

    return {
      success: true,
      userInfo: await userRepository.getById(args.userId, {
        includeSensitiveInfo: true,
      }),
      sessionToken: finalSessionToken,
    };
  };

  validateNextAuthSessionToken = async (session: Session) => {
    if (!session.user) {
      throw new Error('Session User not found');
    }

    const userId = session.user.id as string;

    return {
      userInfo: await userRepository.getById(userId, {
        includeSensitiveInfo: true,
      }),
      sessionToken: session.accessToken || '',
    };
  };

  /** @deprecated */
  removeAllSessions = async (args: SignOutAllSessionsArgs) => {
    const sessionKey = this.getSessionTokensKey(args.userId);
    await redis.del(sessionKey);

    deleteCookie({
      name: SESSION_TOKEN_COOKIE_KEY,
      headers: args.headers,
    });

    deleteCookie({
      name: USER_ID_COOKIE_KEY,
      headers: args.headers,
    });
  };

  accountVerify = async (args: AccountVerifyArgs) => {
    const { input } = args;
    const user = await UserModel.findOne({ verifyToken: input.token });
    if (!user) {
      throw new Error('Verification token is invalid!');
    }

    user.verified = true;
    user.verifyToken = undefined;
    user.lastLogin = new Date();

    const savedUser = await user.save();
    return savedUser.toClientObject();
  };

  forgotPassword = async (args: ForgotPasswordArgs) => {
    const { input, url } = args;
    try {
      const email = input.email.toLowerCase().trim();

      const userDoc = await userRepository.forgotPassword({ email });

      // Send email for forget password change
      const emailData = {
        email: userDoc.email,
        fullName: userDoc.fullName,
        token: userDoc.resetPasswordToken,
      };

      this.logger.info(`Forgot password email sent to ${emailData.email}`);
      // TODO: Implement email service
      // email.send('forgot-password', { to: data.email }, data)

      const searchParams = new URLSearchParams({
        token: emailData.token || '',
        email: emailData.email || '',
      });

      const resetLink = `${url}/reset-password?${searchParams.toString()}`;

      this.logger.debug(`Reset password link: ${resetLink}`);

      return { success: true, url: resetLink }; // Return email data for testing purposes, Will remove later
    } catch (error) {
      throw getTRPCError(error);
    }
  };

  resetPassword = async (args: ResetPasswordArgs) => {
    const { input } = args;

    const userDoc = await userRepository.resetPassword(input);

    // Send email for password change
    const emailData = {
      fullName: userDoc.fullName,
      email: userDoc.email,
    };

    this.logger.info(`Password reset email sent to ${emailData.email}`);
    // TODO: Implement email service
    // email.send('reset-password', { to: emailData.email }, emailData)

    return { success: true };
  };

  createOnboardingStep = async (args: CreateOnboardingStepArgs) => {
    try {
      const { input } = args;
      const { userId, data } = input;
      const { profileSetup, facilitySetup } = data;
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `User not found with id: ${userId}`,
        });
      }

      // Check if email or phone number is already in use by another user
      if (user.email !== profileSetup.email) {
        const emailExists = await UserModel.findOne({ email: profileSetup.email });
        if (emailExists) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Email already in use',
          });
        }
      }

      if (user.phoneNumber !== profileSetup.phoneNumber) {
        const phoneExists = await UserModel.findOne({ phoneNumber: profileSetup.phoneNumber });
        if (phoneExists) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Phone number already in use',
          });
        }
      }

      const loginToken = this.generateSessionToken(userId);

      user.firstName = profileSetup.firstName;
      user.lastName = profileSetup.lastName;
      user.email = profileSetup.email;
      user.phoneNumber = profileSetup.phoneNumber;
      user.avatar = profileSetup.avatar;
      user.isOnboardingComplete = true;
      user.loginToken = loginToken;

      // Create organization
      const organization = {
        name: facilitySetup.facilityName,
        type: facilitySetup.businessType,
        address: facilitySetup.address,
        city: facilitySetup.city,
        pincode: facilitySetup.pincode,
        logo: facilitySetup.logo,
      };
      const organizationDoc = new OrganizationModel(organization);

      organizationDoc.createdBy = user.id;
      organizationDoc.users.push(user.id);
      // Save organization and user
      await organizationDoc.save();
      await user.save();

      return {
        loginToken,
      };
    } catch (error) {
      this.logger.error('Failed to create onboarding step', error);
      throw error;
    }
  };
}

export const authService = new AuthService();
