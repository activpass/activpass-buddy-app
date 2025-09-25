import type { NextAuthConfig, Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { RoleModel } from '@/server/api/routers/role/model/role.model';
import { type IUserData, UserModel } from '@/server/api/routers/user/model/user.model';
import { mongodbConnect } from '@/server/database/mongodb';
import { signInValidationSchema } from '@/validations/auth.validation';
import { DEFAULT_SYSTEM_ROLE_KEY } from '@/validations/role.validation';

import { authBaseConfig } from './auth.base.config';

const returnResponse = (user: IUserData) => {
  return {
    id: user.id,
    email: user.email,
    name: user.fullName,
    avatarUrl: user.avatar?.url,
    orgId: user.orgId,
    verified: user.verified ?? false,
    lastLogin: user.lastLogin || null,
    provider: user.provider,
    role: user.role?.toString() || '',
    isOnboardingComplete: user.isOnboardingComplete ?? false,
  } satisfies Session['user'];
};

export const authConfig = {
  ...authBaseConfig,
  providers: [
    ...authBaseConfig.providers,
    Credentials({
      credentials: { email: {}, password: {}, loginToken: {} },
      authorize: async credentials => {
        await mongodbConnect();
        const loginToken = credentials?.loginToken as string;

        if (loginToken) {
          const user = await UserModel.authenticateWithLoginToken(loginToken);
          const userObj = user.toClientObject();
          return returnResponse(userObj);
        }

        const { email, password } = await signInValidationSchema.parseAsync(credentials);
        const user = await UserModel.authenticate(email, password);
        const role = await RoleModel.findByKey(DEFAULT_SYSTEM_ROLE_KEY.SUPER_ADMIN);
        if (role && user.role?.toString() !== role.id) {
          await UserModel.assignRole(user.id, role.id);
        }
        const userObj = user.toClientObject();
        if (role?._id) {
          userObj.role = role._id;
        }
        return returnResponse(userObj);
      },
    }),
  ],
} satisfies NextAuthConfig;
