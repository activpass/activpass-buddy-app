import { userRepository } from '@/server/api/routers/user/repository/user.repository';
import { mongodbConnect } from '@/server/database/mongodb';

import { getSession } from './auth';

export const getSessionUser = async () => {
  const session = await getSession();
  if (!session?.user) throw new Error('Not authenticated.');
  if (!session.user.id) throw new Error('User ID not found.');

  await mongodbConnect();

  const user = await userRepository.getByIdOrThrow(session.user.id);
  return user;
};
