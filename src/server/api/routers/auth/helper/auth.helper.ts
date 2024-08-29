import mongoose from 'mongoose';

import { userProviderSchema } from '@/validations/auth.validation';

import type { IUserData } from '../../user/model/user.model';
import { ADMIN_CREDENTIALS, AUTH_ROLES } from '../constants';

const organization = new mongoose.Types.ObjectId();
const rootAdminUser: IUserData = {
  id: 'root-admin-user-id',
  username: ADMIN_CREDENTIALS.username,
  email: `${ADMIN_CREDENTIALS.username.toLowerCase()}@activpass.in`,
  rawPassword: ADMIN_CREDENTIALS.password,
  firstName: 'Admin',
  lastName: 'Admin',
  role: AUTH_ROLES.ADMIN,
  verified: true,
  fullName: 'Admin Admin',
  provider: userProviderSchema.enum.email,
  organization,
  orgId: organization.toHexString(),
};

export const isRootAdminUser = (email: string) => {
  return rootAdminUser.username === email || rootAdminUser.email === email;
};

export const getRootAdminUser = () => rootAdminUser;
