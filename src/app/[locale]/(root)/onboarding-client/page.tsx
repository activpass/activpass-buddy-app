import type { FC } from 'react';

import { Logo } from '@/components/Logo';
import { logger } from '@/server/logger';
import { api } from '@/trpc/server';

type OnboardClientPageProps = {
  searchParams: {
    token: string;
  };
};

const OnboardClientPage: FC<OnboardClientPageProps> = async ({ searchParams }) => {
  const { token } = searchParams;
  const verifiedOnboardData = await api.clients.verifyOnboardingToken({ token });
  logger.info(
    '🚀 ~ constOnboardClientPage:FC<OnboardClientPageProps>= ~ verifiedOnboardData:',
    verifiedOnboardData
  );
  return (
    <div className="flex h-full max-h-screen flex-1 flex-col overflow-hidden">
      <nav className="flex-none">
        <div className="4xl:px-[29%] flex w-screen justify-between border-b-2 bg-background p-4 text-foreground shadow-md lg:px-[3%] xl:px-[11%] 2xl:px-[15%] 3xl:px-[22%]">
          <Logo />
        </div>
      </nav>
      <div className="h-full overflow-auto">
        <div className="flex h-full items-center justify-center">
          <div className="max-h-full max-w-6xl p-4 sm:p-0">asdasdas</div>
        </div>
      </div>
    </div>
  );
};

export default OnboardClientPage;
