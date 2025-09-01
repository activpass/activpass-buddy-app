import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { type IUserData, UserModel } from '@/server/api/routers/user/model/user.model';
import { mongodbConnect } from '@/server/database/mongodb';
import { signInValidationSchema } from '@/validations/auth.validation';

import { authBaseConfig } from './auth.base.config';

const returnResponse = (user: IUserData) => {
  return {
    id: user.id,
    email: user.email,
    name: user.fullName,
    avatarUrl: user.avatar?.url,
    orgId: user.orgId,
  };
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
        const userObj = user.toClientObject();
        return returnResponse(userObj);
      },
    }),
  ],
} satisfies NextAuthConfig;
