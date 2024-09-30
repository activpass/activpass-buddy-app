'use client';

import { useSession } from 'next-auth/react';

export const Greeting = () => {
  const session = useSession();

  return (
    <p className="flex items-center space-x-2 text-3xl">
      <span>
        Hi, Welcome <span className="font-bold">{session?.data?.user.name}</span>!
        <span className="">👋</span>
      </span>
    </p>
  );
};
