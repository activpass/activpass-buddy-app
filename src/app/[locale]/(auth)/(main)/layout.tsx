import type { FC, PropsWithChildren } from 'react';

import { WithLayout } from '@/components/Hoc/withLayout';
import { getSession } from '@/lib/auth';
import { redirect } from '@/lib/navigation';

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const session = await getSession();
  const user = session?.user;

  if (user && !user.verified) {
    const searchParams = new URLSearchParams({
      email: user.email || '',
    });
    return redirect(`/signup/success?${searchParams.toString()}`);
  }

  if (user && !user.isOnboardingComplete) {
    return redirect(`/onboarding-step?userId=${user.id}`);
  }

  return <WithLayout layout="auth">{children}</WithLayout>;
};
export default Layout;
