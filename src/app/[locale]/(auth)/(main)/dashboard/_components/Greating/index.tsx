/* eslint-disable react/no-danger */
import { getMe } from '@/server/api/helpers/session';

export const Hello = async () => {
  const user = await getMe();

  return (
    <p className="flex items-center space-x-2">
      <span className="">👋</span>
      <span>
        Hi, Welcome Back <span className="font-bold">{user?.user?.username}</span>!
      </span>
    </p>
  );
};
