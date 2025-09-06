import mongoose from 'mongoose';

import { userProviderSchema } from '@/validations/auth.validation';

import type { IUserData } from '../../user/model/user.model';
import { ADMIN_CREDENTIALS, UserRoleEnum } from '../constants';

const organization = new mongoose.Types.ObjectId();
const rootAdminUser: IUserData = {
  id: 'root-admin-user-id',
  email: `${ADMIN_CREDENTIALS.username.toLowerCase()}@activpass.in`,
  rawPassword: ADMIN_CREDENTIALS.password,
  firstName: 'Admin',
  lastName: 'Admin',
  role: UserRoleEnum.ADMIN,
  verified: true,
  fullName: 'Admin Admin',
  provider: userProviderSchema.enum.email,
  organization,
  orgId: organization.toHexString(),
};

export const isRootAdminUser = (email: string) => {
  return rootAdminUser.email === email;
};

export const getRootAdminUser = () => rootAdminUser;
