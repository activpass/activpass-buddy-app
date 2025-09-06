import { TRPCError } from '@trpc/server';
import type { Session } from 'next-auth';

import { TimeInSeconds } from '@/server/api/enums/time-in-seconds.enum';
import {
  generateMongooseObjectId,
  generateRandomToken,
  getHashToken,
} from '@/server/api/helpers/common';
import { type IUserData, UserModel } from '@/server/api/routers/user/model/user.model';
import { createSecureCookie, deleteCookie } from '@/server/api/utils/cookie-management';
import { getTRPCError } from '@/server/api/utils/trpc-error';
import { redis } from '@/server/database/redis';
import { Logger } from '@/server/logger';

import {
  sendEmailVerificationEmail,
  sendOnboardingCompletionEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} from '../../../services/email';
import { OrganizationModel } from '../../organization/model/organization.model';
import { userRepository } from '../../user/repository/user.repository';
import {
  SESSION_TOKEN_COOKIE_KEY,
  SESSION_TOKENS_PREFIX,
  USER_ID_COOKIE_KEY,
  UserRoleEnum,
} from '../constants';
import {
  type AccountVerifyArgs,
  type AddUserSessionArgs,
  type CreateOnboardingStepArgs,
  type DeleteSessionTokenArgs,
  type ForgotPasswordArgs,
  type ResendVerificationArgs,
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

    // Generate verification token
    const verifyToken = generateRandomToken();

    const data = {
      ...input,
      role: UserRoleEnum.OWNER,
      isOnboardingComplete: false,
      verified: false, // Set to false for new users
      verifyToken,
    };
    const newUser = await userRepository.create({ data });

    if (!newUser) {
      throw getTRPCError('Failed to create user');
    }

    const userClient = newUser.toClientObject();

    // Send verification email
    try {
      const verificationResult = await sendEmailVerificationEmail({
        username:
          userClient.fullName ||
          `${userClient.firstName || ''} ${userClient.lastName || ''}`.trim() ||
          'User',
        email: userClient.email,
        verificationToken: verifyToken,
      });

      this.logger.info(`Email verification sent to ${userClient.email}`, {
        success: verificationResult.success,
        messageId: verificationResult.messageId,
      });

      if (!verificationResult.success) {
        this.logger.error('Failed to send verification email', {
          error: verificationResult.error,
          email: userClient.email,
        });
        // Don't fail signup if email fails - user can resend later
      }
    } catch (error) {
      this.logger.error('Failed to send verification email', {
        error,
        email: userClient.email,
      });
      // Don't fail signup if email fails
    }

    return userClient;
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
      userInfo: await userRepository.getUserCacheById(args.userId, {
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
      userInfo: await userRepository.getUserCacheById(userId, {
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

    const doc = await userRepository.getByEmail(input.email);

    if (doc && doc.verified) return doc.toClientObject();

    const user = await UserModel.findOne({ verifyToken: input.token, email: input.email });

    if (!user) {
      throw new Error('Verification token is invalid!');
    }

    user.verified = true;
    user.verifyToken = undefined;

    const savedUser = await user.save();
    return savedUser.toClientObject();
  };

  forgotPassword = async (args: ForgotPasswordArgs) => {
    const { input } = args;
    try {
      const email = input.email.toLowerCase().trim();

      const userDoc = await userRepository.forgotPassword({ email });
      const user = userDoc.toClientObject();

      if (!user.resetPasswordToken) {
        this.logger.error('Reset password token not set for user', { email: userDoc.email });
        // Don't throw an error to prevent email enumeration attacks
        // Still return success to the user
        return { success: true };
      }

      // Send password reset email
      const resetEmailResult = await sendPasswordResetEmail({
        username:
          user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email,
        resetToken: user.resetPasswordToken!,
        expirationHours: 24,
      });

      this.logger.info(`Forgot password email sent to ${user.email}`, {
        success: resetEmailResult.success,
        messageId: resetEmailResult.messageId,
      });

      if (!resetEmailResult.success) {
        this.logger.error('Failed to send password reset email', {
          error: resetEmailResult.error,
          email: user.email,
        });
        // Don't throw an error to prevent email enumeration attacks
        // Still return success to the user
      }

      return { success: true };
    } catch (error) {
      throw getTRPCError(error);
    }
  };

  resendVerification = async (args: ResendVerificationArgs) => {
    const { input } = args;
    try {
      const email = input.email.trim();

      // Find user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        // Don't throw an error to prevent email enumeration attacks
        return { success: true };
      }

      if (user.verified) {
        // User is already verified
        return { success: true, message: 'Email is already verified' };
      }

      if (!user.verifyToken) {
        // Generate new verification token if not exists
        user.verifyToken = generateRandomToken();
        await user.save();
      }

      // Send verification email
      const verificationResult = await sendEmailVerificationEmail({
        username:
          user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email,
        verificationToken: user.verifyToken!,
      });

      this.logger.info(`Verification email resent to ${user.email}`, {
        success: verificationResult.success,
        messageId: verificationResult.messageId,
      });

      if (!verificationResult.success) {
        this.logger.error('Failed to resend verification email', {
          error: verificationResult.error,
          email: user.email,
        });
        // Don't throw an error to prevent exposing internal errors
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Error in resendVerification', error);
      throw getTRPCError(error);
    }
  };

  resetPassword = async (args: ResetPasswordArgs) => {
    const { input } = args;

    const userDoc = await userRepository.resetPassword(input);
    const user = userDoc.toClientObject();

    // Send password reset success email
    const successEmailResult = await sendPasswordResetSuccessEmail({
      username: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
      email: user.email,
      resetDate: new Date(),
    });

    this.logger.info(`Password reset success email sent to ${user.email}`, {
      success: successEmailResult.success,
      messageId: successEmailResult.messageId,
    });

    if (!successEmailResult.success) {
      this.logger.error('Failed to send password reset success email', {
        error: successEmailResult.error,
        email: user.email,
      });
      // Don't fail the password reset if email fails
    }

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

      // Link user with organization and save user
      user.organization = generateMongooseObjectId(organizationDoc.id);
      await user.save();

      // Send onboarding completion email
      try {
        const onboardingEmailResult = await sendOnboardingCompletionEmail({
          username: user.fullName || `${user.firstName} ${user.lastName}`.trim() || 'User',
          email: user.email,
          facilityName: facilitySetup.facilityName,
          businessType: facilitySetup.businessType,
        });

        this.logger.info(`Onboarding completion email sent to ${user.email}`, {
          success: onboardingEmailResult.success,
          messageId: onboardingEmailResult.messageId,
        });

        if (!onboardingEmailResult.success) {
          this.logger.error('Failed to send onboarding completion email', {
            error: onboardingEmailResult.error,
            email: user.email,
          });
          // Don't fail onboarding if email fails
        }
      } catch (error) {
        this.logger.error('Failed to send onboarding completion email', {
          error,
          email: user.email,
        });
        // Don't fail onboarding if email fails
      }

      return {
        loginToken,
      };
    } catch (error) {
      this.logger.error('Failed to create onboarding step', error);
      throw error;
    }
  };

  checkEmailStatus = async (args: ResendVerificationArgs) => {
    const { input } = args;
    try {
      const email = input.email.trim();

      // Find user by email
      const user = await userRepository.getByEmail(email);
      return { exists: true, verified: user.verified };
    } catch (error) {
      this.logger.error('Error in checkEmailStatus', error);
      return { exists: false, verified: false };
    }
  };
}

export const authService = new AuthService();
